var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
  streetaddress: String,
  district:      { ref: 'Summary', type: String },
  municipality:  { ref: 'Summary', type: String },
  censustract:   { ref: 'Summary', type: String },
  zipcode:       { ref: 'Summary', type: String },
  countywide:    { ref: 'Summary', type: String, default: 'hamilton-county' },
  coordinates:   Array,
  taxbills:      Array
});

var Location = mongoose.model('Location', locationSchema);

module.exports = Location;