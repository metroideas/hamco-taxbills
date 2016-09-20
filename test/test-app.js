process.env.NODE_ENV = 'test';

var request = require('supertest');

describe('App', function() {
  var server;
  
  beforeEach(function() {
    var http = require('http');
    var app = require('../app');
    
    server = http.createServer(app).listen(3000);
  })

  afterEach(function(done) {
    server.close(done);
  })
  
  describe('routes/index', function() {
    it('handles valid GET request', function(done) {
      request(server)
        .get('/')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        })
    })

    it('handles invalid request', function(done) {
      request(server)
        .get('/invalid/path')
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        })
    })
  })
})