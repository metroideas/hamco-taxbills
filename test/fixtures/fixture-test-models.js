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

// Single location test data spanning five years of taxbills:
Fixture.location = function() {
  return {
    inputAddress:       "800 MARKET ST, Chattanooga, TN",
    name:               "800 Market St, Chattanooga, TN 37402",
    googlePlaceID:      "ChIJ18Rgr3xeYIgRp9HNeDUZpbk",
    coordinates:        [ -85.308863, 35.046772 ],
    zipcode:             "37402",
    censusTract:         "47065003100",
    censusBlock:         "470650031001082",
    censusBlockGroup:    "470650031001",
    county:              "hamilton-county",
    countyDistrict:      "county-district-6",
    chattanoogaDistrict: "chattanooga-district-7",
    municipality:        "chattanooga",
    taxbills:            [
      { year: 2012, assessment: { median: 106375, total: 5682011 }, appraisal: { median: 416500, total: 19612406 }, land: { median: 66900, total: 2592300 }, building: { median: 383300, total: 16282600 }, county: { median: 2941, total: 157083 }, municipality: { median: 2456, total: 131169 } },
      { year: 2013, assessment: { median: 107000, total: 5916106 }, appraisal: { median: 397000, total: 20033886 }, land: { median: 70000, total: 3734600 }, building: { median: 370600, total: 15595800 }, county: { median: 2959, total: 163556 }, municipality: { median: 2471, total: 136571 } },
      { year: 2014, assessment: { median: 107000, total: 5951873 }, appraisal: { median: 397000, total: 20153104 }, land: { median: 70000, total: 3734600 }, building: { median: 370600, total: 15595800 }, county: { median: 2959, total: 164541 }, municipality: { median: 2471, total: 137396 } },
      { year: 2015, assessment: { median: 106375, total: 5941192 }, appraisal: { median: 392500, total: 20141847 }, land: { median: 70000, total: 3734600 }, building: { median: 370600, total: 15595800 }, county: { median: 2941, total: 164247 }, municipality: { median: 2456, total: 137151 } },
      { year: 2016, assessment: { median: 109000, total: 5925214 }, appraisal: { median: 397999, total: 20086936 }, land: { median: null, total: null }, building: { median: null, total: null }, county: { median: 3014, total: 163806 }, municipality: { median: 2517, total: 136779 } }
    ]
  }
};

// Summary test docs
Fixture.summary = function() {
  return {
    _id:  'sample',
    name: 'Sample document',
    type: 'summary',
    taxbills: this.location().taxbills
  }
}

Fixture.county = function() {
  return {
    _id:  'hamilton-county',
    name: 'Hamilton County',
    type: 'countywide',
    taxbills: this.location().taxbills
  }
}

Fixture.countyDistrict = function() {
  return {
    _id:  'county-district-6',
    name: 'Hamilton County 6th District',
    type: 'county-district',
    taxbills: this.location().taxbills
  }
}

Fixture.chattanoogaDistrict = function() {
  return {
    _id:  'chattanooga-district-7',
    name: 'Chattanooga 7th District',
    type: 'chattanooga-district',
    taxbills: this.location().taxbills
  }
}

Fixture.censusTract = function() {
  return {
    _id:  '47065003100',
    name: 'Census Tract 31',
    type: 'census-tract',
    taxbills: this.location().taxbills
  }
}

Fixture.censusBlockGroup = function() {
  return {
    _id:  '470650031001',
    name: 'Block Group 1',
    type: 'census-blockgroup',
    taxbills: this.location().taxbills
  }
}

Fixture.censusBlock = function() {
  return {
    _id:  '470650031001082',
    name: 'Block 1082',
    type: 'census-block',
    taxbills: this.location().taxbills
  }
}

Fixture.zipcode = function() {
  return {
    _id:  '37402',
    name: '37402',
    type: 'zipcode',
    taxbills: this.location().taxbills
  }
}

Fixture.municipality = function() {
  return {
    _id:  'chattanooga',
    name: 'Chattanooga',
    type: 'municipality',
    taxbills: this.location().taxbills
  }
}

// Summary test doc collections
Fixture.records = function() {
  return [
    this.summary(),
    this.county(),
    this.countyDistrict(),
    this.chattanoogaDistrict(),
    this.censusTract(),
    this.censusBlockGroup(),
    this.censusBlock(),
    this.zipcode(),
    this.municipality()
  ]
}

Fixture.summaries = function() {
  return this.records().filter(function(r) {
    return r.type != 'summary'
  })
}

module.exports = Fixture;

