var geocoder = require('geocoder')

// Geocodes address input from user; callback function with place_id
module.exports = function(userAddress, cb) {
  geocoder.geocode(userAddress, function(err, data) {
    if (err) return cb(err);
    
    var results;    
    var geo = null;
    
    if (results = data.results[0]) {
      place = results.place_id
    } 
    
    cb(null, place);
  }) 
}
