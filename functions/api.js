const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');



const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

//const feathers = require('@feathersjs/feathers');
const MyService = require('./services/MyService');

module.exports.build = function(aExpress) {

  const api = express(feathers());

// Load app configuration
  api.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
  api.use(helmet());
  api.use(cors());
  api.use(compress());
  api.use(express.json());
  api.use(express.urlencoded({extended: true}));
  api.use(favicon(path.join(api.get('public'), 'favicon.ico')));
// Host the public folder
  api.use('/', express.static(api.get('public')));

// Set up Plugins and providers
  api.configure(express.rest());


// Configure other middleware (see `middleware/index.js`)
  api.configure(middleware);
// Set up our services (see `services/index.js`)
  api.configure(services);
// Set up event channels (see channels.js)
  api.configure(channels);

// Configure a middleware for 404s and the error handler
  // api.use(express.notFound()); // let our api handle its endpoints
  api.use(express.errorHandler({logger}));

  api.use('/service', new MyService());

  api.hooks(appHooks);

  if (aExpress)
    aExpress.use(api);
  let result = aExpress || api;
  api.setup(result);  // required by feathers for subapps
  return result;
}

