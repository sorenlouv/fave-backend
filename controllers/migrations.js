/*jslint node: true */

var Meal = require('../models/Meal');
var Restaurant = require('../models/Restaurant');

exports.addCoordinateToMeal = function (req, res, next) {
  'use strict';

  Restaurant.find().lean().exec(function(err, restaurants){
    Meal.find().exec(function(err, meals){

      meals.forEach(function (mealModel) {
        var meal = mealModel.toObject();

        // Get restaurant where the meal comes from
        var restaurant = restaurants.filter(function (restaurant) {
          return restaurant._id.equals(meal.restaurant._id);
        })[0];
        if(restaurant === undefined){
          console.log('Cannot find restaurant for ', meal.restaurant);
          return;
        }

        // add coordinate to meal
        mealModel.restaurant.coordinate = restaurant.location.coordinate;

        mealModel.save(function(err){
          if(err){
            console.log('err', err);
          }else{
            console.log('Updated', mealModel.toObject().name);
          }
        });
      });
    });
  });

  res.send('Finished');

  return next();
};

exports.removeRestaurantsWithoutMeals = function (req, res, next) {
  'use strict';

  Restaurant.find().exec(function(err, restaurants){

    restaurants.forEach(function (restaurant){
      var restaurant_id = restaurant.get('_id');
      Meal.count({'restaurant._id': restaurant_id}, function(err, count){
        if(err === null && count === 0){
          restaurant.remove();
        }
      });
    });
  });

  res.send('Finished');

  return next();
};
