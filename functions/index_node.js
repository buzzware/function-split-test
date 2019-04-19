const {loadAndBuild} = require('./firebuilder');

const main = loadAndBuild('main');
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
