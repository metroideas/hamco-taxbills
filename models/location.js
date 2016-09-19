var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
  formattedAddress:    String,
  countyDistrict:      { ref: 'Summary', type: String },
  chattanoogaDistrict: { ref: 'Summary', type: String },
  municipality:        { ref: 'Summary', type: String },
  censusTract:         { ref: 'Summary', type: String },
  censusBlockGroup:    { ref: 'Summary', type: String },
  censusBlock:         { ref: 'Summary', type: String },
  zipcode:             { ref: 'Summary', type: String },
  countywide:          { ref: 'Summary', type: String, default: 'hamilton-county' },
  coordinates:         Array,
  taxbills:            Array
});

var Location = mongoose.model('Location', locationSchema);

module.exports = Location;