/*jslint node: true */

var mongoose = require('mongoose');
var Meal = require('../models/Meal');
var utils = require('../utils');

/*
 *
 *
 *******************************************/
exports.add = function (req, res, next) {
  var meal = new Meal(req.body);

  // Save
  meal.save(function(err){
    utils.handleOutput(res, err, meal);
  });

  return next();
};

/*
 *
 *
 *******************************************/
exports.getSingle = function (req, res, next) {
  var params = utils.parseParameters(req.params);

  Meal.findOne(params.query).exec(function (err, meal) {
    utils.handleOutput(res, err, meal);
  });

  return next();
};

/*
 *
 *
 *******************************************/
exports.getAll = function (req, res, next) {
  var params = utils.parseParameters(req.params);

  Meal.find(params.query).skip(params.offset).limit(params.limit).exec(function(err, meals){
    utils.handleOutput(res, err, meals);
  });

  return next();
};

/*
*
*
*******************************************/

exports.getByCategory = function (req, res, next) {
  var params = utils.parseParameters(req.params);

  Meal.find({'restaurant.categories':{$elemMatch:{$in:[params.query.category]}}}).skip(params.offset).limit(params.limit).exec(function(err, meals){
    utils.handleOutput(res, err, meals);
  });

  return next();
};

/*
 *
 *
 *******************************************/
exports.getClosest = function(req, res, next){
  var params = utils.parseParameters(req.params);

  if(!req.params.longitude || !req.params.latitude){
    res.send({"error": "Missing location"});
  }

  // Filter meals by distance within
  var radius = req.params.radius || 1;
  var query = {
    "restaurant.coordinate" : {
      $geoWithin : {
        $centerSphere: [ [ req.params.longitude, req.params.latitude ] , radius / 6371 ]
      }
    }
  };

  // Filter meals by category
  if(req.params.category){
    query['restaurant.categories'] = {
      $elemMatch: {$in:[req.params.category]}
    };
  }
  Meal.find(query).skip(params.offset).limit(params.limit).sort(params.sort).exec(function(err, restaurants){
    utils.handleOutput(res, err, restaurants);
  });

  return next();
};