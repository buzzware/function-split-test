const {FUNCTION_NAME} = process.env;

const express = require('express');
const functions = require('firebase-functions');

function dummy(){
  return functions.https.onRequest(function (req,res) {
        console.log('BEGIN dummy');
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Dummy Endpoint');
        res.end();
  });
}

const expressApp = express();

let app,api;

console.log('setting up '+FUNCTION_NAME);
if (FUNCTION_NAME=='app') {
  app = require('./app/index').app;
  app(expressApp);
} else if (FUNCTION_NAME=='api') {
  // api = dummy();
  // api = require('./api/src/index').app;
  // api(expressApp);
  // api = functions.https.onRequest(expressApp);
  // app = dummy();
}

exports.app = app ? functions.https.onRequest(expressApp) : dummy();
exports.api = api ? functions.https.onRequest(expressApp) : dummy();
