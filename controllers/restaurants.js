/*jslint node: true */

var mongoose = require('mongoose');
var Restaurant = require('../models/Restaurant');
var utils = require('../utils');

/*
 * Add a restaurant
 *
 *******************************************/
exports.add = function (req, res, next) {
  var restaurant = new Restaurant(req.body);

  // Save
  restaurant.save(function(err){
    utils.handleOutput(res, err, restaurant);
  });

  return next();
};

/*
 * Get a single restaurant by _id
 *
 *******************************************/
exports.getSingle = function (req, res, next) {
  var params = utils.parseParameters(req.params);

  Restaurant.findOne(params.query).exec(function (err, restaurant) {
    utils.handleOutput(res, err, restaurant);
  });

  return next();
};

/*
 * Update a single restaurant by _id
 *
 *******************************************/
exports.updateSingle = function (req, res, next) {
  // Upsert (update or insert)
  Restaurant.update({_id: req.params._id}, req.body, {upsert: true}, function(err){
    utils.handleOutput(res, err);
  });

  return next();
};

/*
 * Get list of all restaurants
 *
 *******************************************/
exports.getAll = function (req, res, next) {
  var params = utils.parseParameters(req.params);

  Restaurant.find(params.query).skip(params.offset).limit(params.limit).exec(function(err, restaurants){
    utils.handleOutput(res, err, restaurants);
  });

  return next();
};

exports.getClosest = function(req, res, next){
  var params = utils.parseParameters(req.params);
  var query;

  if(req.params.longitude && req.params.latitude){
    var radius = req.params.radius || 1;
    query = {
      "location.coordinate" : {
        $geoWithin : {
          $centerSphere: [ [ req.params.longitude, req.params.latitude ] , radius / 6371 ]
        }
      }
    };
  }else{
    query = req.params;
  }

  Restaurant.find(query).skip(params.offset).limit(params.limit).exec(function(err, restaurants){
    utils.handleOutput(res, err, restaurants);
  });

  return next();
};

/*
 * Only for Yelp scraping
 * Get internal _id by looking up yelp id
 *******************************************/
exports.getByYelpId = function (req, res, next) {
  var params = utils.parseParameters(req.params);

  Restaurant.findOne(params.query).select('id').exec(function (err, restaurant) {
    utils.handleOutput(res, err, restaurant);
  });

  return next();
};