/*jslint node: true */

var Meal = require('../models/Meal');
var Restaurant = require('../models/Restaurant');

exports.addRestaurantInfoToMeal = function (req, res, next) {

  Restaurant.find().lean().exec(function(err, restaurants){
    Meal.find().exec(function(err, meals){

      meals.forEach(function (mealModel) {
        var meal = mealModel.toObject();

        // already migrated
        if(mealModel.toObject().restaurant.categories.length > 0){
          console.log("Already migrated", mealModel.toObject().name);
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

        // add restaurant category to meal
        mealModel.restaurant.categories = restaurant.categories;

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

exports.removeRestaurantsWithoutMeals = function (req, res, next) {

  Restaurant.find().exec(function(err, restaurants){

    restaurants.forEach(function (restaurant){
      var restaurant_id = restaurant.get('_id');
      Meal.count({"restaurant._id": restaurant_id}, function(err, count){
        if(err === null && count === 0){
          restaurant.remove();
        }
      });
    });
  });

  res.send("Finished");

  return next();
};