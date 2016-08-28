// Tests API functionality for hamco-taxbills
process.env.NODE_ENV = 'test';

var request = require('supertest');
var assert = require('chai').assert;
var models = require('./fixtures/test-models');
var fixture = require('./fixtures/test-api');

describe('API', function() {
  // Setup and teardown server on each API test
  var server;
  
  beforeEach(function() {
    server = fixture.createServer();
  });

  afterEach(function(done) {
    server.close(done);
  });
  
  // Returns Location document by coordinates
  describe('GET location by coordinates', function() {
    
    // Add addresses collection to test database
    var Location = require('../models/location');
    var location = models.location();
    var url = '/api/coordinates/' + location.coordinates.join('/');

    beforeEach(function(done) {
      models.saveRecord(Location, location, done);
    });

    // Remove addresses collection from test database
    afterEach(function(done) {
      models.dropCollection(Location, done);
    });

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

    it('requires long-lat coordinate parameters', function(done) {
      request(server)
        .get('/api/coordinates')
        .end(function(err, res) {
          if (err) done(err);

          assert.equal(res.status, 400);
          done();
        })
    })

    it('returns empty array when coordinates not found', function(done) {
      Location.collection.drop();

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

