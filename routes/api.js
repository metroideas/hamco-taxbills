var express = require('express');
var router = express.Router();
var Location = require('../models/location');
var Summary = require('../models/summary');

// API routes
router.get('/coordinates/:lng/:lat', findLocationByCoordinates);
router.get('/coordinates', badRequest);

// Bad request handler for malformed API calls
function badRequest(req, res) {
  res.status(400).send('Bad Request');
}

// Look up Location object by coordinate parameters
function findLocationByCoordinates(req, res) {
  var lng = +req.params.lng;
  var lat = +req.params.lat;

  // Sends '400: Bad Request' on non-numeric coordinate parameters
  if (Number.isNaN(lng) || Number.isNaN(lat)) {
    badRequest(req, res);
    return ;
  }
  
  // Location result populated with Summary docs
  Location.findOne({ coordinates: [lng, lat] })
    .populate([
      'countyDistrict',
      'chattanoogaDistrict',
      'municipality',
      'zipcode',
      'censusTract',
      'censusBlockGroup',
      'censusBlock',
      'countywide'
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
