/*jslint node: true */

var spawn = require('child_process').spawn;
var mongoose = require('mongoose');
// var Deployment = require('../models/Deployment');
var utils = require('../utils');

/*
 * Add new deployment
 *
 *******************************************/
exports.add = function (req, res, next) {
  // var deployment = new Deployment(req.body);

  // // Save
  // deployment.save(function(err){
  //   utils.handleOutput(res, err, deployment);
  // });

  // Github payload data
  var repositoryName = req.body.repository.name;
  var pushed_at = req.body.pushed_at;
  var pusher = req.body.pusher;

  // Directories
  var frontendRepo = '../' + repositoryName;
  var frontendWWW = '../' + repositoryName + '/www';
  var backendRepo = './';

  // Variables
  var messages = '';

  var onProcessError = function(error, args){
    console.log('error: ', error);
    res.send({
      error: error,
      args: args,
      messages: messages
    });
  };

  // Pull changes from master
  var gitPull = function(repo){
    var args = ['git', ['pull', 'origin', 'master'], {cwd: repo}];
    console.log("Running", args);
    var process = spawn.apply(this, args);

    // Event: When process exited normally
    process.on('exit', function(code){
      if(code === 0){
        res.send("Finished successfully");
        console.log("Finished successfully");
      }else{
        onProcessError("Exit status was " + code, args);
      }
    });

    // Event: When process exited with an error
    process.on('error', function(error){
      onProcessError(error, args);
    });

    // Event: On message (debugging)
    process.stdout.on('data', function(msg){
      console.log('message: ' + msg);
      messages += msg;
    });
  };

  if(repositoryName === "fave-frontend"){
    gitPull(frontendRepo);
  }else if(repositoryName === "fave-backend"){
    gitPull(backendRepo);
  }


  return next();
};
