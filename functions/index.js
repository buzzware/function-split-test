const functions = require('firebase-functions');
//const admin = require('firebase-admin');
//const adminApp = admin.initializeApp();
//adminApp.firestore().settings({timestampsInSnapshots: true});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

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

function timeout(promise, timeoutMillis=10000) {
  var timeout;
  return Promise.race([
    promise,
    new Promise(function(resolve, reject) {
      timeout = setTimeout(function() {
        reject(new Error('Timeout'));
      }, timeoutMillis);
    }),
  ]).then(function(v) {
    clearTimeout(timeout);
    return v;
  }, function(err) {
    clearTimeout(timeout);
    throw err;
  });
};


// async function getData(aCollection,aId) {
//   let ref = await timeout(adminApp.firestore().collection(aCollection).doc(aId).get());
//   return ref.exists ? ref.data() : null;
// }

exports.hello = jsonEndpoint('GET',async (req) => {
  return {
    success: true
  };
});
