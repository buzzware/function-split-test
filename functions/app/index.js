const functions = require('firebase-functions');

function jsonEndpoint(aVerb,aHandler) {
  return functions.https.onRequest(async function (req,res) {
    try {
      if (aVerb && (req.method !== aVerb))
        throw new Error('Only '+aVerb+' is supported');
      var response;

      let output = await aHandler(req);

      if (output) {
        res.header({'Cache-Control': 'private, no-cache, no-store, must-revalidate'});
        res.status(200).json(output);
      } else {
        res.writeHead(204, { 'Content-Type':'text/json' });
        res.end();
      }
    } catch (e) {
      res.status(e.status || 500).json({error: e.message});
    }
  });
}

exports.app = jsonEndpoint('GET',async (req) => {
  console.log('BEGIN hello');
  console.log(JSON.stringify(process.env));
  return {
    success: true
  };
});
