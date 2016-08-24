process.env.NODE_ENV = 'test';

var request = require('supertest');

describe('API', function() {
  var server;
  
  beforeEach(function() {
    var http = require('http');
    var app = require('../app');
    
    server = http.createServer(app).listen(3000);
  })

  afterEach(function(done) {
    server.close(done);
  })

  describe('routes/api/locations', function() {
    it('returns array of objects matching coordinates')
    it('requires numeric parameters')
  })

  describe('routes/api/districts', function() {
    it('returns array of all district summary objects')
    it('returns array of district objects matching district number')
    it('requires numeric parameters')
  })

  describe('routes/api/zipcode', function() {
    it('returns array of all zipcode summary objects')
    it('returns array of zipcode objects matching zipcode number')
    it('requires numeric parameters')
  })

  describe('routes/api/censustract', function() {
    it('returns array of all censustract summary objects')
    it('returns array of censustract objects matching censustract number')
    it('requires numeric parameters')
  })

  describe('routes/api/municipality', function() {
    it('returns array of all municipality summary objects')
    it('returns array of municipality objects matching municipality string')
    it('string parameter is not case-sensitive')
  })
})

