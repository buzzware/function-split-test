const express = require('express');
const Main = require('./Main');

const baseApp = express();
const expressApp = express();

Main.setup(expressApp);

baseApp.use('/api',expressApp);

baseApp.listen(3000);

// module.exports = {
// 	api: expressApp,
// };
