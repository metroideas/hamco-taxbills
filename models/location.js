var mongoose = require('mongoose');

var locationSchema = mongoose.Schema({
  streetaddress: String,
  district:      String,
  municipality:  String,
  censustract:   String,
  zipcode:       String,
  coordinates:   Array,
  taxbills:      Array
});

// Virtual getter methods
// Location attribute fields convert to Summary _id
locationSchema.virtual('countyDistrictId').get(function() {
  return 'district-' + this.district;
});

locationSchema.virtual('censusTractId').get(function() {
  return this.censustract;
});

locationSchema.virtual('zipcodeId').get(function() {
  return this.zipcode;
});

locationSchema.virtual('municipalityId').get(function() {
  return this.municipality.replace(' ', '-').toLowerCase();
});

var Location = mongoose.model('Location', locationSchema);

module.exports = Location;