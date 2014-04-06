/*jslint node: true */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Validators
var isUnique = [function(value, callback){

  // Create meal if in item with identical image, restaurant id and name doesn't exits.
  // NB. Allowing updates by adding the $ne (not) operator
  var query = {
    image: this.image,
    "restaurant._id": this.restaurant._id,
    name: this.name,
    _id: { $ne: this._id }
  };

  Meal.count(query, function(err, count){
    callback(count === 0);
  });
}, 'The meal already exists'];

var Meal = mongoose.model('Meal', {
  name: {
    type: String,
    required: true,
    validate: isUnique
  },
  description: String,
  faves: Number,
  image: {
    type: String
  },
  category: String,
  prices: [{
    amount: Number,
    label: String
  }],
  restaurant: {
    name: String,
    coordinate: {type: [Number], index: '2d'},
    categories: [Schema.Types.Mixed],
    phone: String,
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    }
  },
  review_count: Number,
  updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Meal', Meal);
