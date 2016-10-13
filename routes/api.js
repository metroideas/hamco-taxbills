var express = require('express');
var router = express.Router();
var geocoder = require('../controllers/geocoder');
var Location = require('../models/location');
var Summary = require('../models/summary');

// API routes
router.get('/address/:address', findLocationByAddress);
router.get('/:id', findLocationById);
router.get('/', badRequest);

// Bad request handler for malformed API calls
function badRequest(req, res) {
  res.status(400).send('Bad Request');
}

// Call Google geocoder before local database
function findLocationByAddress(req, res) {
  var address = req.params.address;

  if (!address) {
    badRequest(req, res);
    return ;
  }


  geocoder(address, function(err, geo) {
    if (err) {
      // Geocoder error
      badRequest(req, res)
      return ;
    }

    if (!geo) {
      // No response from geocoder
      badRequest(req, res)
      return ;
    }

    req.params.id = geo;
    findLocationById(req, res);
  })
}

// Look up Location object by coordinate parameters
function findLocationById(req, res) {
  var place = req.params.id;

  // Sends '400: Bad Request' on non-numeric coordinate parameters
  if (!place) {
    badRequest(req, res);
    return ;
  }
  
  // Location result populated with Summary docs
  Location.findOne({ googlePlaceID: place })
    .populate([
      'countyDistrict',
      'chattanoogaDistrict',
      'municipality',
      'zipcode',
      'censusTract',
      'censusBlockGroup',
      'censusBlock',
      'county'
    ])
    .exec(function(err, result) {
      if (err) res.json({'ERROR': err});

      if (!result) {
        res.status(200).send({});
      } else {
        res.json(result);  
      }
    });
}

module.exports = router;
