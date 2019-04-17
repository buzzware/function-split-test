const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const MyService = require('./services/MyService');
let app = require('./app/index').app;

// function dummy(){
//   return functions.https.onRequest(function (req,res) {
//     console.log('BEGIN dummy');
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('Dummy Endpoint');
//     res.end();
//   });
// }

const mainApp = express();

mainApp.all('*', async (req, res, next) => {
  const { path } = req;
  console.info('Received request at', path);
  //console.log(req);
  return next();
});

app(mainApp); //attach express app

// setup feathers api
const api = express(feathers()).configure(express.rest());
api.use('/service', new MyService());

// mount api to mainApp
mainApp.use('/api', api);

// start server
const server = mainApp.listen(3030);
api.setup(server);  // required by feathers for subapps

