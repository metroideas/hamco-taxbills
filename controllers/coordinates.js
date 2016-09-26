var geocoder = require('geocoder')

// Geocodes address input from user and calls callback function with coordinates
module.exports = function(userAddress, cb) {
  geocoder.geocode(userAddress, function(err, data) {
    if (err) return cb(err);
    
    var results;    
    var coordinates = null;

    if (results = data.results[0]) {
      var lng = results.geometry.location.lng;
      var lat = results.geometry.location.lat;
      coordinates = [lng, lat];
    } 

    cb(null, coordinates);
  }) 
}
