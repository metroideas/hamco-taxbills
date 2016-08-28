// Tests database models for hamco-taxbills
process.env.NODE_ENV = 'test';

var chai = require('chai');
var assert = chai.assert;
var app = require('../app');
var models = require('./fixtures/test-models');

describe('Models', function() {

  describe('Location', function() {
    // Add addresses collection to test database
    var
    Location = require('../models/location'),
    location = models.location();
    ;
    
    beforeEach(function(done) {
      models.saveRecord(Location, location, done);
    });

    // Remove addresses collection from test database
    afterEach(function(done) {
      models.dropCollection(Location, done);
    });

    it('schema', function(done) {
      Location.find({ streetaddress: location.streetaddress }, function(err, docs) {
        if (err) done(err);

        var result = docs[0];

        assert.typeOf(result.streetaddress, 'string');
        assert.typeOf(result.district, 'string');
        assert.typeOf(result.municipality, 'string');
        assert.typeOf(result.censustract, 'string');
        assert.typeOf(result.zipcode, 'string');
        assert.typeOf(result.coordinates, 'array');
        assert.typeOf(result.taxbills, 'array');

        done();
      });
    });

    it('maintains state', function(done) {
      Location.find({ streetaddress: location.streetaddress }, function(err, docs) {
        if (err) done(err);

        // .toJSON() prevents AssertionError on array comparison
        var result = docs[0].toJSON();

        assert.equal(result.streetaddress, location.streetaddress);    
        assert.equal(result.district, location.district);
        assert.equal(result.municipality, location.municipality);
        assert.equal(result.censustract, location.censustract);
        assert.equal(result.zipcode, location.zipcode);
        assert.deepEqual(result.coordinates, location.coordinates);
        assert.deepEqual(result.taxbills, location.taxbills);

        done();
      });
    })

    it('attribute fields convert to Summary _id', function(done) {
      Location.find({ streetaddress: location.streetaddress }, function(err, docs) {
        if (err) done(err);

        var result = docs[0];

        assert.equal(result.countyDistrictId, 'district-6');
        assert.equal(result.censusTractId, '47065003100');
        assert.equal(result.zipcodeId, '37402');
        assert.equal(result.municipalityId, 'chattanooga');

        result.municipality = 'East Ridge';
        assert.equal(result.municipalityId, 'east-ridge', 'municipalityId slugs and lowercases');

        done();
      })
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