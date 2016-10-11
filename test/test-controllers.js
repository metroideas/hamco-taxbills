process.env.NODE_ENV = 'test';

var assert = require('chai').assert;
var geocoder = require('../controllers/geocoder');
var location = require('../controllers/location');
var models = require('./fixtures/fixture-test-models');

describe('Geocoder controller', function() {
  var loc = models.location();
  
  it('gets googlePlaceID of input address', function(done) {
    geocoder(loc.inputAddress, function(err, geo) {
      if (err) return done(err);

      assert.deepEqual(geo, loc.googlePlaceID);

      done();
    })  
  })

  it('returns null on invalid input', function(done) {
    geocoder('Invalid address input', function(err, geo) {
      if (err) return done(err);

      assert.equal(geo, null);

      done();
    })
  })
})

describe('Location controller', function() {
  var server;
  var fixture = require('./fixtures/fixture-test-api');
  var Location = require('../models/location');
  var Summary = require('../models/summary');
  var loc = models.location();
  var summaries = models.summaries();

  beforeEach(function()     { server = fixture.createServer(); });
  beforeEach(function(done) { models.saveRecord(Location, loc, done); });
  beforeEach(function(done) { models.insertMany(Summary, summaries, done); });
  afterEach(function(done)  { server.close(done); });
  afterEach(function(done)  { models.dropCollection(Location, done); });
  afterEach(function(done)  { models.dropCollection(Summary, done); });

  it('Retrieves populated location object', function(done) {
    location(loc.googlePlaceID, function(err, location) {
      if (err) return done(err);

      assert.equal(location.inputAddress, loc.inputAddress);
      assert.deepEqual(location.taxbills, loc.taxbills);
      assert.equal(location.municipality._id, loc.municipality);
      assert.equal(location.zipcode._id, loc.zipcode);

      done();
    })
  })

  it('Retrieves empty object when location not found')
})
