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

let appApp = express();
app(appApp); //attach express app
mainApp.use('/app', appApp);

// setup feathers api
const api = express(feathers()).configure(express.rest());
api.use('/service', new MyService());

// mount api to mainApp
mainApp.use('/api', api);
api.setup(mainApp);  // required by feathers for subapps

const server = mainApp.listen(3030);

/*
should serve at :

http://localhost:3030/api/service
http://localhost:3030/app/express

*/
