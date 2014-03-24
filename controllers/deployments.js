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

  var onProcessError = function(error, args){
    console.log('error: ', error);
    res.send("Error: " + error + "Args: " + JSON.stringify(args));
  };

  var onProcessMessage = function(msg){
    // console.log('message: ' + msg);
  };

  var onProcessExit = function(code, args, callback){
    if(code === 0){
      callback();
    }else{
      onProcessError("Exit status was " + code, args);
    }
  };

  var onProcessSuccess = function(){
    res.send("Finished successfully");
    console.log("Finished successfully");
  };

  // Pull changes from master
  var gitPull = function(repo, callback){
    var args = ['git', ['pull', 'origin', 'master'], {cwd: repo}];
    console.log("Running", args);
    var process = spawn.apply(this, args);

    // Events
    process.on('exit', function(code){
      onProcessExit(code, args, callback);
    });
    process.on('error', function(error){
      onProcessError(error, args);
    }); // On error
    process.stdout.on('data', onProcessMessage); // On message (debugging)
  };

  // install grunt plugins
  var npmInstall = function(){
    var args = ['npm', ['install'], {cwd: frontendWWW}];
    console.log("Running", args);
    var process = spawn.apply(this, args);

    // Events
    process.on('exit', function(code){
      onProcessExit(code, args, grunt); // On exit (process finished "normally")
    });
    process.on('error', function(error){
      onProcessError(error, args);
    }); // On error
    process.stdout.on('data', onProcessMessage); // on message (debugging)
  };

  // run grunt
  var grunt = function(){
    var args = ['grunt', [], {cwd: frontendWWW}];
    console.log("Running", args);
    var process = spawn.apply(this, args);

    // Events
    process.on('exit', function(code){
      onProcessExit(code, args, onProcessSuccess); // On exit (process finished "normally")
    });
    process.on('error', onProcessError); // On error
    process.stdout.on('data', onProcessMessage); // on message (debugging)
  };


  if(repositoryName === "fave-frontend"){
    gitPull(frontendRepo, npmInstall);
  }else if(repositoryName === "fave-backend"){
    gitPull(backendRepo, onProcessSuccess);
  }


  return next();
};
