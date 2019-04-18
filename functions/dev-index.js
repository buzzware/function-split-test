const express = require('@feathersjs/express');

function loadAndBuild(aEndpoint,aExpress) {
  const {build} = require('./'+aEndpoint);
  return build(aExpress);
}


const main = loadAndBuild('main'  );
const api = loadAndBuild('api');
const front = loadAndBuild('front');

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
