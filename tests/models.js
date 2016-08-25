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

        // .toJSON() avoids AssertionError on array comparison
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
  })

  describe('District', function() {
    it('schema')
  })

  describe('CensusTract', function() {
    it('schema')
  })

  describe('Year', function() {
    it('schema')
  })

  describe('Zipcode', function() {
    it('schema')
  })

  describe('Municipality', function() {
    it('schema')
  })
});