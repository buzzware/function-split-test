const ExpressUtils = require('../utilities/ExpressUtils');
const express = require('express');
const morgan = require('morgan');

exports.app = function(expressApp) {

  expressApp.use(morgan('dev'));
  expressApp.use(express.json());
  // expressApp.use(express.urlencoded({ extended: false }));
  //expressApp.use(cookieParser());
  //expressApp.use(express.static(path.join(__dirname, 'public')));

  ExpressUtils.jsonEndpoint(expressApp,null,'/app/express','GET',(req)=>{
    return {message: 'hi from express'};
  });

};
