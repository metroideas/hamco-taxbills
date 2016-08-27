var mongoose = require('mongoose');

// Summary objects share a common schema in which their _id attribute
// is a hyphenated version of their Address attributes. 
var summarySchema = mongoose.Schema({
  _id:  { type: String, required: true },
  name: String,   // Display name
  type: String, 
  taxbills: Array
});

// Summary types:
// countywide
// district
// municipality
// zipcode
// censustract

// All summary objects have an aggregate taxbills array that is the sum of all matching Address docs
// Each taxbill has a year field, thus negating the need for annual summary type

// Address has virtual getter methods that return a Summary _id

// countywide:

// - 'hamilton-county'

// district:

// - district-1
// - district-2
// - district-3
// - district-4
// - district-5
// - district-6
// - district-7
// - district-8
// - district-9

// municipality:

// - unincorporated
// - chattanooga
// - soddy-daisy
// - east-ridge
// - red-bank
// - lookout-mountain
// - signal-mountain
// - walden
// - collegedale
// - ridgeside
// - lakesite

// zipcode:

// - 37302
// - 37308
// - 37409
// - 37408
// - 37421
// - 37415
// - 37412
// - 37411
// - 37416
// - 37405
// - 37406
// - 37404
// - 37407
// - 37419
// - 37403
// - 37410
// - 37402
// - 37315
// - 37341
// - 37343
// - 37350
// - 37351
// - 37363
// - 37373
// - 37377
// - 37379

// censustract: Use census tract ids from PostGIS

var Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;