var express = require('express');
var router = express.Router();
var Location = require('../models/location');
var Summary = require('../models/summary');

// API routes
router.get('/:id', findLocationById);
router.get('/', badRequest);

// Bad request handler for malformed API calls
function badRequest(req, res) {
  res.status(400).send('Bad Request');
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
