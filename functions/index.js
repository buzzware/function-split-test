const {FUNCTION_NAME} = process.env;
const functions = require('firebase-functions');

const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');


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

let app,api;

console.log('setting up '+FUNCTION_NAME);
if (FUNCTION_NAME=='app') {
  app = require('./app/index').app;
  app(mainApp);
} else if (FUNCTION_NAME=='api') {
  const MyService = require('./services/MyService');
  const api = express(feathers()).configure(express.rest());
  api.use('/service', new MyService());

  // mount api to mainApp
  mainApp.use(api);
  api.setup(mainApp);  // required by feathers for subapps
}

exports.app = app ? functions.https.onRequest(mainApp) : dummy();
exports.api = api ? functions.https.onRequest(mainApp) : dummy();
