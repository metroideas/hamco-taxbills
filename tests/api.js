// Tests coordinates API
process.env.NODE_ENV = 'test';

var request = require('supertest');
var assert = require('chai').assert;
var models = require('./fixtures/test-models');
var fixture = require('./fixtures/test-api');

// Returns Location document by coordinates
describe('Coordinates API', function() {
  var server;
  
  // Add model data to test database
  var Location  = require('../models/location');
  var Summary   = require('../models/summary');
  var location  = models.location();
  var summaries = models.summaries();
  var url       = '/api/coordinates/' + location.coordinates.join('/');

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

  it('requires long-lat coordinate parameters', function(done) {
    request(server)
      .get('/api/coordinates')
      .end(function(err, res) {
        if (err) done(err);

        assert.equal(res.status, 400);
        done();
      })
  })

  it('requires numeric coordinate parameters', function(done) {
    request(server)
      .get('/api/coordinates/foo/bar')
      .end(function(err, res) {
        if (err) done(err);

        assert.equal(res.status, 400);
        done();
      })
  })

  it('returns empty object when Location not found', function(done) {
    Location.collection.drop();

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

        assert.isObject(res.body.countyDistrict);
        assert.isObject(res.body.chattanoogaDistrict);
        assert.isObject(res.body.municipality);
        assert.isObject(res.body.censusTract);
        assert.isObject(res.body.censusBlockGroup);
        assert.isObject(res.body.censusBlock);
        assert.isObject(res.body.zipcode);

        done();
      })
  })
});

