// Tests coordinates API
process.env.NODE_ENV = 'test';

var request = require('supertest');
var assert = require('chai').assert;
var models = require('./fixtures/fixture-test-models');
var fixture = require('./fixtures/fixture-test-api');

// Returns Location document by coordinates
describe('Location API', function() {
  var server;
  
  // Add model data to test database
  var Location  = require('../models/location');
  var Summary   = require('../models/summary');
  var location  = models.location();
  var summaries = models.summaries();
  var url       = '/api/' + location.googlePlaceID;

  beforeEach(function() {
    server = fixture.createServer();
  });

  beforeEach(function(done) {
    models.saveRecord(Location, location, done);
  });

  beforeEach(function(done) {
    models.insertMany(Summary, summaries, done);
  });

  // Close server and drop test collections
  afterEach(function(done) {
    server.close(done);
  });

  afterEach(function(done) {
    models.dropCollection(Location, done);
  });

  afterEach(function(done) {
    models.dropCollection(Summary, done);
  });

  // Tests
  it('returns JSON response', function(done) {
    request(server)
      .get(url)
      .end(function(err, res) {
        if (err) done(err);

        assert.equal(res.status, 200);
        assert.match(res.type, /json/);
        assert.isObject(res.body);

        done();
      });
  })

  it('requires :id parameter', function(done) {
    request(server)
      .get('/api/')
      .end(function(err, res) {
        if (err) done(err);

        assert.equal(res.status, 400);
        done();
      })
  })

  it('returns empty object when Location not found', function(done) {
    var url = '/api/foobar'

    request(server)
      .get(url)
      .end(function(err, res) {
        if (err) done(err);

        assert.equal(res.status, 200);
        assert.isObject(res.body);
        done();
      });
  })

  it('populated with summary objects', function(done) {
    request(server)
      .get(url)
      .end(function(err, res) {
        if (err) done(err);

        assert.deepEqual(res.body.countyDistrict, models.countyDistrict());
        assert.deepEqual(res.body.chattanoogaDistrict, models.chattanoogaDistrict());
        assert.deepEqual(res.body.municipality, models.municipality());
        assert.deepEqual(res.body.censusTract, models.censusTract());
        assert.deepEqual(res.body.censusBlockGroup, models.censusBlockGroup());
        assert.deepEqual(res.body.censusBlock, models.censusBlock());
        assert.deepEqual(res.body.zipcode, models.zipcode());

        done();
      })
  })
});

