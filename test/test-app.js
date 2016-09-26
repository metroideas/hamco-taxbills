process.env.NODE_ENV = 'test';

var request = require('supertest');
var assert = require('chai').assert;
var models = require('./fixtures/fixture-test-models');

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
  
  describe('GET', function() {
    it('handles valid request', function(done) {
      request(server)
        .get('/')
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        })
    });

    it('returns 404 on invalid request', function(done) {
      request(server)
        .get('/invalid/path')
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        })
    });

    it('loads initial data')
    
    it('page maintains state')
  });

  describe('POST', function() {
    var location = models.location();

    it('accepts form data', function(done) {  
      request(server)
        .post('/')
        .send({ userAddress: location.formattedAddress })
        .set('Accept', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          assert.equal(res.request._data.userAddress, location.formattedAddress);

          done();
        })
    })

    it('form requires nonblank input')
  })
})