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

  var onProcessError = function(msg){
    console.log('error: ' + msg);
  };

  var onProcessMessage = function(msg){
    // console.log('message: ' + msg);
  };

  // Pull changes from master
  var gitPull = function(repo, callback){
    var args = ['git', ['pull', 'origin', 'master'], {cwd: repo}];
    console.log("Running", args);
    var process = spawn.apply(this, args);
    if(callback) process.on('exit', callback);
    process.on('error', onProcessError);
    process.stdout.on('data', onProcessMessage);
  };

  // install grunt plugins
  var npmInstall = function(){
    var args = ['npm', ['install'], {cwd: frontendWWW}];
    console.log("Running", args);
    var process = spawn.apply(this, args);
    process.on('exit', grunt);
    process.on('error', onProcessError);
    process.stdout.on('data', onProcessMessage);
  };

  // run grunt
  var grunt = function(){
    var args = ['grunt', [], {cwd: frontendWWW}];
    console.log("Running", args);
    var process = spawn.apply(this, args);
    process.on('error', onProcessError);
    process.stdout.on('data', onProcessMessage);
  };


  if(repositoryName === "fave-frontend"){
    gitPull(frontendRepo, npmInstall);
  }else if(repositoryName === "fave-backend"){
    gitPull(backendRepo);
  }

  res.send("Done");


  return next();
};
