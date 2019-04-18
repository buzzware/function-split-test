const ExpressUtils = require('../utilities/ExpressUtils');
const express = require('express');
const morgan = require('morgan');

exports.build = function(aExpress) {
  if (!aExpress)
    aExpress = express();

  aExpress.use(morgan('dev'));
  aExpress.use(express.json());
  // expressApp.use(express.urlencoded({ extended: false }));
  //expressApp.use(cookieParser());
  //expressApp.use(express.static(path.join(__dirname, 'public')));

  ExpressUtils.jsonEndpoint(aExpress,null,'/hello','GET',(req)=>{
    return {message: 'hello from front'};
  });

  return aExpress;
};
