const functions = require('firebase-functions');

const {FUNCTION_NAME} = process.env;

const express = require('@feathersjs/express');


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

function loadAndBuild(aEndpoint,aExpress) {
  console.log('loadAndBuild '+aEndpoint)
  const {build} = require('./'+aEndpoint);
  return build(aExpress);
}


const main = loadAndBuild('main',express());

if (FUNCTION_NAME)
  loadAndBuild(FUNCTION_NAME,main);

exports.front = functions.https.onRequest(main);
exports.api = functions.https.onRequest(main);

/*
should serve at eg. :

https://us-central1-function-split-test.cloudfunctions.net/api/service
http://localhost:3030/api/service

and

http://localhost:5001/function-split-test/us-central1/app/express
http://localhost:3030/app/express
*/
