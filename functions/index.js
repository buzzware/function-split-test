const {FUNCTION_NAME} = process.env;
const ON_GCP = !!process.env.X_GOOGLE_FUNCTION_REGION;
const ON_EMULATOR = !ON_GCP;

const functions = require('firebase-functions');

const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');

console.log(process.env);

function dummy(){
  return functions.https.onRequest(function (req,res) {
        console.log('BEGIN dummy');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Dummy Endpoint');
        res.end();
  });
}

const mainApp = express();

mainApp.all('*', async (req, res, next) => {
  const { path } = req;
  console.info('Received request at', path);
  //console.log(req);
  return next();
});

/*

Whats going on here ?

Background :
* GCP creates a separate runtime per function, and each function
executes with FUNCTION_NAME set to the name of the assigned function.
* There is no need to initialise dependencies for functions that the
current runtime will never serve. So we can save memory and startup time
by conditionally setting each one up.
* We must appear to export all functions we ever serve here, for firebase functions
to find and allocate runtimes. In reality, we only export a blank express app for
functions we will never execute in each runtime.
* There are undocumented rules for how Firebase discovers exported functions, and
some methods of conditional exports caused them to fail to be found, so this is code
is a bit fragile.
*/

console.log('setting up '+FUNCTION_NAME);
if (FUNCTION_NAME=='app') {
  const app = require('./app/index').app;
  app(mainApp);
} else if (FUNCTION_NAME=='api') {
  const MyService = require('./services/MyService');
  const api = express(feathers()).configure(express.rest());
  api.use('/service', new MyService());

  // mount api to mainApp
  mainApp.use(api);
  api.setup(mainApp);  // required by feathers for subapps
}

exports.app = functions.https.onRequest(mainApp);
exports.api = functions.https.onRequest(mainApp);

