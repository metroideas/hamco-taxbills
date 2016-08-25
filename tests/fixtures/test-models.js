var Fixture = {};

// Add record to database collection
Fixture.saveRecord = function(Model, record, done) {
  new Model(record).save(function(err) {
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

module.exports = Fixture;