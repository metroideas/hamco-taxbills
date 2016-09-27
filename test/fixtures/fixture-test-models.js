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
    formattedAddress:    '800 Market St, Chattanooga, TN 37402, USA',
    place_id:            'ChIJ18Rgr3xeYIgRp9HNeDUZpbk',
    countyDistrict:      'county-district-6',
    chattanoogaDistrict: 'chattanooga-district-7',
    municipality:        'chattanooga',
    censusTract:         '47065003100',
    censusBlockGroup:    '470650031001',
    censusBlock:         '470650031001082',
    zipcode:             '37402',
    coordinates:         [ -85.308863, 35.046772 ],
    taxbills:            [
      { year: "2011", assessment: 5354640, appraisal: 18730697, land: 2592300, building: 15654000, county: 148039, municipality: 123616 },
      { year: "2012", assessment: 5682011, appraisal: 19612406, land: 2592300, building: 16282600, county: 157083, municipality: 131169 },
      { year: "2013", assessment: 5916106, appraisal: 20033886, land: 3734600, building: 15595800, county: 163556, municipality: 136571 },
      { year: "2014", assessment: 5951873, appraisal: 20153104, land: 3734600, building: 15595800, county: 164541, municipality: 137396 },
      { year: "2015", assessment: 5941192, appraisal: 20141847, land: 3734600, building: 15595800, county: 164247, municipality: 137151 }
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

