// Tests database models for hamco-taxbills
process.env.NODE_ENV = 'test';

var chai = require('chai');
var assert = chai.assert;
var app = require('../app');
var models = require('./fixtures/fixture-test-models');

describe('Models', function() {
  describe('Location', function() {
    // Add locations collection to test database
    var
    Location = require('../models/location'),
    location = models.location()
    ;
    
    beforeEach(function(done) {
      models.saveRecord(Location, location, done);
    });

    // Remove locations collection from test database
    afterEach(function(done) {
      models.dropCollection(Location, done);
    });

    // Tests
    it('schema', function(done) {
      Location.find({ formattedAddress: location.formattedAddress }, function(err, docs) {
        if (err) done(err);

        var result = docs[0];

        assert.typeOf(result.formattedAddress, 'string');
        assert.typeOf(result.place_id, 'string');
        assert.typeOf(result.countyDistrict, 'string');
        assert.typeOf(result.chattanoogaDistrict, 'string');
        assert.typeOf(result.municipality, 'string');
        assert.typeOf(result.censusTract, 'string');
        assert.typeOf(result.censusBlockGroup, 'string');
        assert.typeOf(result.censusBlock, 'string');
        assert.typeOf(result.zipcode, 'string');
        assert.typeOf(result.coordinates, 'array');
        assert.typeOf(result.taxbills, 'array');

        done();
      });
    });

    it('maintains state', function(done) {
      Location.find({ formattedAddress: location.formattedAddress }, function(err, docs) {
        if (err) done(err);

        // .toJSON() prevents AssertionError on array comparison
        var result = docs[0].toJSON();

        assert.equal(result.inputAddress, location.inputAddress);
        assert.equal(result.place_id, location.place_id);
        assert.equal(result.countyDistrict, location.countyDistrict);
        assert.equal(result.chattanoogaDistrict, location.chattanoogaDistrict);
        assert.equal(result.municipality, location.municipality);
        assert.equal(result.censusTract, location.censusTract);
        assert.equal(result.censusBlockGroup, location.censusBlockGroup);
        assert.equal(result.censusBlock, location.censusBlock);
        assert.equal(result.zipcode, location.zipcode);
        assert.deepEqual(result.coordinates, location.coordinates);
        assert.deepEqual(result.taxbills, location.taxbills);

        done();
      });
    })
  })

  describe('Summary', function() {
    // Add summaries collection to test database
    var
    Summary      = require('../models/summary'),
    summary      = models.summary(),
    records      = models.records()
    ;

    beforeEach(function(done) {
      models.insertMany(Summary, records, done);
    });

    // Remove summaries collection from test database
    afterEach(function(done) {
      models.dropCollection(Summary, done);
    });

    // Tests
    it('schema', function(done) {
      Summary.findById(summary._id, function(err, result) {
        if (err) done(err);

        assert.typeOf(result._id, 'string');
        assert.typeOf(result.name, 'string');
        assert.typeOf(result.type, 'string');
        assert.typeOf(result.taxbills, 'array');

        done();
      })
    })

    it('maintains state', function(done) {
      Summary.findById(summary._id, function(err, result) {
        if (err) done(err);

        assert.equal(result.name, summary.name);
        assert.equal(result.type, summary.type);
        assert.deepEqual(result.toJSON().taxbills, summary.taxbills);

        done();
      })
    })

    // Check type _id
    models.summaries().forEach(function(summary) {
      it(summary.type + ' type via _id', function(done) {
        Summary.findById(summary._id, function(err, result) {
          if (err) done(err);

          assert.equal(result.type, summary.type);

          done();
        })
      })
    });
  })
});