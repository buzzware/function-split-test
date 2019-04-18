const express = require('@feathersjs/express');

module.exports = class ExpressAppBuilder {

  // Each method should decorate with endpoints or append to the given Express instance. If null, create your own.
  // The returned express apps will be mounted with use() by the calling code.

  static buildMain(aExpress) {
    if (!aExpress)
      aExpress = express();
    aExpress.all('*', async (req, res, next) => {
      const {path} = req;
      console.info('Received request at', path);
      //console.log(req);
      return next();
    });
    return aExpress;
  }

  static buildFront(aExpress) {
    if (!aExpress)
      aExpress = express();
    const {build} = require('./front/index');
    return build(aExpress);
  }

  static buildApi(aExpress) {
    const feathers = require('@feathersjs/feathers');
    const MyService = require('./services/MyService');

    const logger = require('./logger');
    const build = require('./api');
    const api = build();
    //const port = api.get('port');

    // process.on('unhandledRejection', (reason, p) =>
    //   logger.error('Unhandled Rejection at: Promise ', p, reason)
    // );

    //const apiExpress = express(feathers()).configure(express.rest());
    api.use('/service', new MyService());

    if (aExpress)
      return aExpress.use(api);
    let result = aExpress || api;
    api.setup(aExpress || api);  // required by feathers for subapps
    return api;
  }

};
