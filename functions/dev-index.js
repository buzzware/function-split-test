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

const mainExpress = express();

mainExpress.all('*', async (req, res, next) => {
  const { path } = req;
  console.info('Received request at', path);
  //console.log(req);
  return next();
});

let appExpress = express();
app(appExpress);
mainExpress.use('/app', appExpress);

// setup feathers api
const apiExpress = express(feathers()).configure(express.rest());
apiExpress.use('/service', new MyService());
mainExpress.use('/api', apiExpress);
apiExpress.setup(mainExpress);  // required by feathers for subapps

const server = mainExpress.listen(3030);

/*
should serve at :

http://localhost:3030/api/service
http://localhost:3030/app/express

*/
