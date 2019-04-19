const express = require('express');

module.exports.build = function() {
  let main = express();
  main.all('*', async (req, res, next) => {
    const {path} = req;
    console.info('Received request at', path);
    //console.log(req);
    return next();
  });
  return main;
};
