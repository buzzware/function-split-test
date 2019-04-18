const express = require('@feathersjs/express');

module.exports.build = function(aExpress) {
  if (!aExpress)
    aExpress = express();
  aExpress.all('*', async (req, res, next) => {
    const {path} = req;
    console.info('Received request at', path);
    //console.log(req);
    return next();
  });
  return aExpress;
};
