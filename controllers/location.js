var request = require('request');

var server = {
  development: 'http://localhost:3000/',
  test: 'http://localhost:3000/',
  production: ''
}[process.env.NODE_ENV]

var options = {
  url: server.concat('api/coordinates/'),
  method: "GET",
  json: {},
}

// Queries location API for matching JSON
module.exports = function(coordinates, cb) {
  options.url += coordinates.join('/');

  request(options, function(err, response, location) {
    if (err) return cb(err);

    cb(null, location);
  })
}