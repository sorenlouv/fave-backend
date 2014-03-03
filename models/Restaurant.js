/*jslint node: true */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Validators
var isUnique = [function(restaurantId, callback){
  // only create restaurant if it doesn't already exist
  Restaurant.count({id: restaurantId}, function(err, count){
    callback(count === 0);
  });
}, 'The restaurant already exists'];

var Restaurant = mongoose.model('Restaurant', {
  id: {
    type: String,
    validate: isUnique
  },
  name: {
    type: String,
    required: true
  },
  rating: Number,
  review_count: Number,
  snippet_image_url: String,
  phone: String,
  snippet_text: String,
  image_url: String,
  categories: [Schema.Types.Mixed],
  display_phone: String,
  location: {
    city: String,
    display_address: [String],
    neighborhoods: [String],
    postal_code: Number,
    country_code: String,
    address: [String],
    state_code: String,
    coordinate: {type: [Number], index: '2d'}
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Restaurant', Restaurant);
