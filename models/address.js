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

// Virtual getter methods
// Address attribute fields convert to Summary _id
addressSchema.virtual('countyDistrictId').get(function() {
  return 'district-' + this.district;
});

addressSchema.virtual('censusTractId').get(function() {
  return this.censustract;
});

addressSchema.virtual('zipcodeId').get(function() {
  return this.zipcode;
});

addressSchema.virtual('municipalityId').get(function() {
  return this.municipality.replace(' ', '-').toLowerCase();
});

var Address = mongoose.model('Address', addressSchema);

module.exports = Address;