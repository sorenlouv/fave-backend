/*jslint node: true */

// Dependencies
var extend = require('util')._extend;

exports.handleOutput = function(res, err, successOutput){
  // Error occured
  if (err){
    if(err.errors){
      res.send(err.errors);
    }else if(err.message){
      // res.send({error: err.message});
      console.log('error', err.message);
    }else{
      res.send(JSON.stringify(err));
    }

  // No error occured
  }else{
    if(successOutput){
      res.send(successOutput);
    }else{
      res.send({"success": true});
    }
  }
};

// Parse query parameters
exports.parseParameters = function(reqParams){
  var offset = reqParams.offset || 0;
  var limit = reqParams.limit || 10;

  var sort = {};
  if(reqParams.sort){
    var sort_order = isNaN(Number(reqParams.sort_order)) ? 1 : Number(reqParams.sort_order);
    sort[reqParams.sort] = sort_order;
  }

  var query = extend({}, reqParams); // Clone
  delete query.offset;
  delete query.limit;
  delete query.sort;

  return {
    query: query,
    offset: offset,
    limit: limit,
    sort: sort
  };
};