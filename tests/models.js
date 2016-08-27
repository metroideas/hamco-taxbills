// Tests database models for hamco-taxbills
process.env.NODE_ENV = 'test';

var chai = require('chai');
var assert = chai.assert;
var app = require('../app');
var models = require('./fixtures/test-models');

describe('Models', function() {

  describe('Address', function() {
    // Add addresses collection to test database
    var Address = require('../models/address');
    var address = models.address();
    
    beforeEach(function(done) {
      models.saveRecord(Address, address, done);
    });

    // Remove addresses collection from test database
    afterEach(function(done) {
      models.dropCollection(Address, done);
    });

    it('schema', function(done) {
      Address.find({ streetaddress: address.streetaddress }, function(err, docs) {
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
      Address.find({ streetaddress: address.streetaddress }, function(err, docs) {
        if (err) done(err);

        // .toJSON() prevents AssertionError on array comparison
        var result = docs[0].toJSON();

        assert.equal(result.streetaddress, address.streetaddress);    
        assert.equal(result.district, address.district);
        assert.equal(result.municipality, address.municipality);
        assert.equal(result.censustract, address.censustract);
        assert.equal(result.zipcode, address.zipcode);
        assert.deepEqual(result.coordinates, address.coordinates);
        assert.deepEqual(result.taxbills, address.taxbills);

        done();
      });
    })

    it('attribute fields convert to Summary _id', function(done) {
      Address.find({ streetaddress: address.streetaddress }, function(err, docs) {
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
    it('schema')

    it('maintains state')

    it('includes county districts')
    it('includes census tracts')
    it('includes zip codes')
    it('includes municipalities')
  })
});