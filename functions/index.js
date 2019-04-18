const functions = require('firebase-functions');
const express = require('@feathersjs/express');
const {loadAndBuild} = require('./firebuilder');

const {FUNCTION_NAME} = process.env;

const main = loadAndBuild('main',express());

if (FUNCTION_NAME)
  loadAndBuild(FUNCTION_NAME,main);

exports.front = functions.https.onRequest(main);
exports.api = functions.https.onRequest(main);
