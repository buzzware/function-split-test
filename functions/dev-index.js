const express = require('@feathersjs/express');

const ExpressAppBuilder = require('./ExpressAppBuilder');

const main = ExpressAppBuilder.buildMain();
const api = ExpressAppBuilder.buildApi();
const front = ExpressAppBuilder.buildFront();

let port = api.get('port');

main.use('/api',api);
main.use('/front',front);

main.listen(port, function(){
  console.log('The server is running, ' +
    ' please, open your browser at http://localhost:%s',
    port);
});

/*
should serve at :

http://localhost:3030/api/service
http://localhost:3030/front/hello

*/
