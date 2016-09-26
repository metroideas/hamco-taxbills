process.env.NODE_ENV = 'test';

var assert = require('chai').assert;
var coordinates = require('../controllers/coordinates');
var location = require('../controllers/location');
var models = require('./fixtures/fixture-test-models');

describe('Coordinates controller', function() {
  var loc = models.location();
  
  it('gets coordinates of input address', function(done) {
    coordinates(loc.formattedAddress, function(err, coordinates) {
      if (err) return done(err);
      
      assert.deepEqual(coordinates, loc.coordinates);

      done();
    })  
  })

  it('returns null on invalid input', function(done) {
    coordinates('Invalid address input', function(err, coordinates) {
      if (err) return done(err);

      assert.equal(coordinates, null);

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
    location(loc.coordinates, function(err, location) {
      if (err) return done(err);

      assert.equal(location.formattedAddress, loc.formattedAddress);
      assert.deepEqual(location.taxbills, loc.taxbills);
      assert.equal(location.municipality._id, loc.municipality);
      assert.equal(location.zipcode._id, loc.zipcode);

      done();
    })
  })

  it('Retrieves empty object when location not found')
})
