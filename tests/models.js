process.env.NODE_ENV = 'test';

var chai = require('chai');
var assert = chai.assert;
var mongoose = require('mongoose');
var app = require('../app');
var data = require('./fixtures/test-models-data');

describe('Models', function() {

  describe('Address', function() {
    var Address = require('../models/address');
    var address = data.address();
    
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