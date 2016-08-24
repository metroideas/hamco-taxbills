var mongoose = require('mongoose');

var addressSchema = mongoose.Schema({
  streetaddress: String,
  district:      String,
  municipality:  String,
  censustract:   String,
  zipcode:       String,
  coordinates:   Array,
  taxbills:      Array
});

var Address = mongoose.model('Address', addressSchema);

module.exports = Address;