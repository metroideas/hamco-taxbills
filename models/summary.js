var mongoose = require('mongoose');

// Summary objects share a common schema in which their _id attribute
// is a hyphenated version of their Address attributes. 
var summarySchema = mongoose.Schema({
  // _id: String,
  // name: String,   // Display name
  // type: String,   // Redundant? Used for testing
  // taxbills: Array,
  // geo: Object     // Optional GeoJSON
})

// Summary types:
// County district
// Municipality
// ZIP code
// Census tract

// All summary objects have an aggregate taxbills array that is the sum of all matching Address docs
// Each taxbill has a year field, thus negating the need for a year summary type - An annual county overview
// can be found in the summary doc where _id == 'district-0'

// TO DO: Will need to write some conversion methods to ensure Address attributes match 
// these _id formats
// Additionally, will need to ensure the api/coordinate route pulls all the available data for a particular 
// long-lat coordinate pair

// District _id

// - district-0 // All Hamilton County
// - district-1
// - district-2
// - district-3
// - district-4
// - district-5
// - district-6
// - district-7
// - district-8
// - district-9

// Municipality _id

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

// ZIP code _id

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

// Census tract _id

// - Use census tract ids from PostGIS

var Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;