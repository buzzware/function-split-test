const {FUNCTION_NAME} = process.env;

const functions = require('firebase-functions');

const express = require('@feathersjs/express');

const mainExpress = express();

mainExpress.all('*', async (req, res, next) => {
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

Description:

Basically we create an express app (feathers version of express) and conditionally
decorate it according to the function we are serving.
Then we ask firebase functions to serve the express app for every function.

*/

console.log('setting up '+FUNCTION_NAME);
if (FUNCTION_NAME=='app') {
  const app = require('./app/index').app;
  app(mainExpress);
} else if (FUNCTION_NAME=='api') {
  const feathers = require('@feathersjs/feathers');
  const MyService = require('./services/MyService');
  const apiExpress = express(feathers()).configure(express.rest());
  apiExpress.use('/service', new MyService());
  apiExpress.setup(mainExpress);  // required by feathers for subapps
  mainExpress.use(apiExpress);
}

exports.app = functions.https.onRequest(mainExpress);
exports.api = functions.https.onRequest(mainExpress);

/*
should serve at eg. :

https://us-central1-function-split-test.cloudfunctions.net/api/service
http://localhost:3030/api/service

and

http://localhost:5001/function-split-test/us-central1/app/express
http://localhost:3030/app/express
*/

// /* eslint-disable no-console */
// const logger = require('./logger');
// const app = require('./app');
// const port = app.get('port');
// const server = app.listen(port);
//
// process.on('unhandledRejection', (reason, p) =>
//   logger.error('Unhandled Rejection at: Promise ', p, reason)
// );
//
// server.on('listening', () =>
//   logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
// );
