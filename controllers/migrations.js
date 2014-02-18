var mongoose = require('mongoose');
var Meal = require('../models/Meal');
var Restaurant = require('../models/Restaurant');
var utils = require('../utils');


exports.addRestaurantInfoToMeal = function (req, res, next) {

  Restaurant.find().lean().exec(function(err, restaurants){
    Meal.find().exec(function(err, meals){

      meals.forEach(function (mealModel, index) {
        var meal = mealModel.toObject();

        // already migrated
        if(meal.restaurant._bsontype !== "ObjectID"){
          console.log("Already migrated", mealModel.toObject().name);
          return;
        }

        // Get restaurant where the meal comes from
        var restaurant = restaurants.filter(function (restaurant) {
          return restaurant._id.equals(meal.restaurant);
        })[0];
        if(restaurant === undefined){
          console.log("Cannot find restaurant for ", meal.restaurant);
          return;
        }

        mealModel.set('name', mealModel.toObject().title);
        mealModel.restaurant = {
          name: restaurant.name,
          coordinate: restaurant.location.coordinate,
          _id: restaurant._id
        };

        mealModel.save(function(err){
          if(err){
            console.log("err", err);
          }else{
            console.log("Updated", mealModel.toObject().name);
          }
        });
      });
    });
  });

  res.send("Finished");

  return next();
};