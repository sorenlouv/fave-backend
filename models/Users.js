var mongoose = require('mongoose');

var Users = mongoose.model('Users', {
  facebook_id: Number,
  email: String,
  name: String,
  first_name: String,
  last_name: String,
});

module.exports = mongoose.model('Users', Users);
