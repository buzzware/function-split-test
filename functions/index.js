const functions = require('firebase-functions');
const {loadAndBuild} = require('./firebuilder');

const {FUNCTION_NAME} = process.env;

const main = loadAndBuild('main');

if (FUNCTION_NAME) {
  let expressApp = loadAndBuild(FUNCTION_NAME);
  main.use(expressApp);
}

exports.front = functions.https.onRequest(main);
exports.api = functions.https.onRequest(main);
