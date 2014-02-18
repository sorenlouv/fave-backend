// Controllers
var meals = require('./controllers/meals');
var restaurants = require('./controllers/restaurants');
var migrations = require('./controllers/migrations');
// var users = require('./controllers/users');

module.exports = function (server) {

  // Meals
  server.post('/meal', meals.add);
  server.get('/meal', meals.getAll);
  server.get('/meal/closest', meals.getClosest);
  server.get('/meal/:_id', meals.getSingle);

  // Restaurants
  server.post('/restaurant', restaurants.add);
  server.get('/restaurant', restaurants.getAll);
  server.get('/restaurant/closest', restaurants.getClosest);
  server.get('/restaurant/:_id', restaurants.getSingle);
  server.put('/restaurant/:_id', restaurants.updateSingle); // Mostly for scrapers

  server.get('/restaurant/id/:id', restaurants.getById); // Mostly for scrapers

  // Migration scripts
  server.get('/migrations/add_restaurant_info_to_meal', migrations.addRestaurantInfoToMeal);

};