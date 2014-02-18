// Dependencies
var extend = require('util')._extend;

exports.handleOutput = function(res, err, successOutput){
  // Error occured
  if (err){
    if(err.errors){
      res.send(err.errors);
    }else if(err.message){
      res.send({error: err.message});
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

  var query = extend({}, reqParams);
  delete query.offset;
  delete query.limit;

  return {
    query: query,
    offset: offset,
    limit: limit
  };
};