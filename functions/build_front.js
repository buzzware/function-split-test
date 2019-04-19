const ExpressUtils = require('./utilities/ExpressUtils');
const express = require('express');
const morgan = require('morgan');

exports.build = function() {
  let front = express();

  front.use(morgan('dev'));
  front.use(express.json());
  // expressApp.use(express.urlencoded({ extended: false }));
  //expressApp.use(cookieParser());
  //expressApp.use(express.static(path.join(__dirname, 'public')));

  ExpressUtils.jsonEndpoint(front,null,'/hello','GET',(req)=>{
    return {message: 'hello from front'};
  });

  return front;
};
