var Fixture = {};

// Save record to database collection
Fixture.saveRecord = function(Model, record, done) {
  new Model(record).save(function(err) {
    if (err) done(err);
    done();
  });
}
// Bulk insert records to database collection
Fixture.insertMany = function(Model, records, done) {
  Model.insertMany(records, function(err, docs) {
    if (err) done(err);
    done();
  });
}

// Drops collection from database
Fixture.dropCollection = function(Model, done) {
  Model.collection.drop();
  done();
}

// Single address test data spanning five years of taxbills:
// var address = require('./fixtures/test-models-data').address()
Fixture.address = function() {
  return {
    streetaddress: '800 Market St, Chattanooga, TN 37402, USA',
    district:      '6',
    municipality:  'Chattanooga',
    censustract:   '47065003100',
    zipcode:       '37402',
    coordinates:   [-85.308863, 35.046772],
    taxbills:      [{ "year": "2011", "assessment": 32850, "appraisal": 131400, "building": 124200, "land": 7200, "county": 908.3682, "municipality": 758.5065 },{ "year": "2012", "assessment": 32850, "appraisal": 131400, "building": 124200, "land": 7200, "county": 908.3682, "municipality": 758.5065 },{ "year": "2013", "assessment": 33500, "appraisal": 134000, "building": 126800, "land": 7200, "county": 926.342, "municipality": 773.515 },{ "year": "2014", "assessment": 33500, "appraisal": 134000, "building": 126800, "land": 7200, "county": 926.342, "municipality": 773.515 },{ "year": "2015", "assessment": 33500, "appraisal": 134000, "building": 126800, "land": 7200, "county": 926.342, "municipality": 773.515 }]
  }
};

Fixture.summary = function() {
  return {
    _id:  'sample',
    name: 'Sample document',
    type: 'summary',
    taxbills: this.address().taxbills
  }
}

Fixture.county = function() {
  return {
    _id:  'hamilton-county',
    name: 'Hamilton County',
    type: 'countywide',
    taxbills: this.address().taxbills
  }
}

Fixture.district = function() {
  return {
    _id:  'district-6',
    name: '6th District',
    type: 'district',
    taxbills: this.address().taxbills
  }
}

Fixture.censustract = function() {
  return {
    _id:  '47065003100',
    name: 'Census Tract 31',
    type: 'censustract',
    taxbills: this.address().taxbills
  }
}

Fixture.zipcode = function() {
  return {
    _id:  '37402',
    name: '37402',
    type: 'zipcode',
    taxbills: this.address().taxbills
  }
}

Fixture.municipality = function() {
  return {
    _id:  'chattanooga',
    name: 'Chattanooga',
    type: 'municipality',
    taxbills: this.address().taxbills
  }
}

Fixture.records = function() {
  return [
    this.summary(), this.county(), this.district(), this.censustract(), this.zipcode(), this.municipality()
  ]
}

Fixture.summaries = function() {
  return this.records().filter(function(r) {
    return r.type != 'summary'
  })
}

module.exports = Fixture;