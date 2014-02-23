/*jslint node: true */

var Meal = require('../models/Meal');
var Restaurant = require('../models/Restaurant');

exports.addRestaurantCoordinateToMeal = function (req, res, next) {

  Restaurant.find().lean().exec(function(err, restaurants){
    Meal.find().exec(function(err, meals){

      meals.forEach(function (mealModel) {
        var meal = mealModel.toObject();

        // already migrated
        if(meal.restaurant.coordinate !== undefined){
          console.log("Already got coordinate", mealModel.toObject().name);
          return;
        }

        // Get restaurant where the meal comes from
        var restaurant = restaurants.filter(function (restaurant) {
          return restaurant._id.equals(meal.restaurant._id);
        })[0];
        if(restaurant === undefined){
          console.log("Cannot find restaurant for ", meal.restaurant);
          return;
        }

        // add restaurant coordinate to meal
        mealModel.restaurant.coordinate = restaurant.location.coordinate;

        // add restaurant name to meal
        mealModel.restaurant.name = restaurant.name;

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