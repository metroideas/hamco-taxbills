var Fixture = {};

// Server setup for api tests
Fixture.createServer = function() {
  var http = require('http');
  var app = require('../../app');
    
  return http.createServer(app).listen(3000);
}

module.exports = Fixture;