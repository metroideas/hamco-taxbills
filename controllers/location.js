var request = require('request');

var server = {
  development: 'http://localhost:3000/api/',
  test: 'http://localhost:3000/api/',
  production: ''
}[process.env.NODE_ENV]

var options = {
  method: "GET",
  json: {},
}

// Queries location API for matching JSON
module.exports = function(geo, cb) {
  options.url = server + geo;

  request(options, function(err, response, location) {
    if (err) return cb(err);

    cb(null, location);
  })
}