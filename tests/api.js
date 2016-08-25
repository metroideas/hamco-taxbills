process.env.NODE_ENV = 'test';

var request = require('supertest');
var assert = require('chai').assert;

describe('API', function() {
  var server;
  
  beforeEach(function() {
    var http = require('http');
    var app = require('../app');
    
    server = http.createServer(app).listen(3000);
  })

  afterEach(function(done) {
    server.close(done);
  })

  describe('GET address by coordinates', function() {
    var Address = require('../models/address');
    var address = require('./fixtures/test-models-data').address();
    var url = '/api/coordinates/' + address.coordinates.join('/');

    beforeEach(function(done) {
      new Address(address).save(function(err) {
        if (err) done(err);
        done();
      });
    });

    afterEach(function(done) {
      Address.collection.drop();
      done();
    })

    it('returns JSON response', function(done) {
      request(server)
        .get(url)
        .end(function(err, res) {
          if (err) done(err);

          assert.equal(res.status, 200);
          assert.match(res.type, /json/);
          assert.isArray(res.body);
          assert.lengthOf(res.body, 1);

          done();
        });
    })

    it('requires long-lat coordinates', function(done) {
      request(server)
        .get('/api/coordinates')
        .end(function(err, res) {
          if (err) done(err);

          assert.equal(res.status, 400);
          done();
        })
    })

    it('returns empty array when coordinates not found', function(done) {
      Address.collection.drop();

      request(server)
        .get(url)
        .end(function(err, res) {
          if (err) done(err);

          assert.equal(res.status, 200);
          assert.lengthOf(res.body, 0);
          done();
        });
    })
  });

  describe('routes/api/districts', function() {
    it('returns array of all district summary objects')
    it('returns array of district object matching district number')
    it('requires numeric parameter')
  })

  describe('routes/api/zipcode', function() {
    it('returns array of all zipcode summary objects')
    it('returns array of zipcode object matching zipcode number')
    it('requires numeric parameter')
  })

  describe('routes/api/censustract', function() {
    it('returns array of all censustract summary objects')
    it('returns array of censustract object matching censustract number')
    it('requires numeric parameter')
  })

  describe('routes/api/year', function() {
    it('returns array of all year summary objects')
    it('returns array of year object matching year number')
    it('requires numeric parameter')
  })

  describe('routes/api/municipality', function() {
    it('returns array of all municipality summary objects')
    it('returns array of municipality object matching municipality string')
    it('string parameter is not case-sensitive')
  })
})

