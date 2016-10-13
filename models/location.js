var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
  inputAddress:        String,
  googlePlaceID:       String,
  name:                String,
  countyDistrict:      { ref: 'Summary', type: String },
  chattanoogaDistrict: { ref: 'Summary', type: String },
  municipality:        { ref: 'Summary', type: String },
  censusTract:         { ref: 'Summary', type: String },
  censusBlockGroup:    { ref: 'Summary', type: String },
  censusBlock:         { ref: 'Summary', type: String },
  zipcode:             { ref: 'Summary', type: String },
  county:              { ref: 'Summary', type: String },
  coordinates:         Array,
  taxbills:            Array
});

var Location = mongoose.model('Location', locationSchema);

module.exports = Location;