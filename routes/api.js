var express = require('express');
var router = express.Router();
var Location = require('../models/location');

// API routes
router.get('/coordinates/:lng/:lat', findLocationByCoordinates);
router.get('/coordinates', badRequest);

// Bad request handler for malformed API calls
function badRequest(req, res) {
  res.status(400).send('Bad Request');
}

// Look up Location object by coordinate parameters:
// GET /api/coordinates/-85.308863/35.046772
function findLocationByCoordinates(req, res) {
  var lng = +req.params.lng;
  var lat = +req.params.lat;
  
  Location.find({ coordinates: [lng, lat] }).exec(function(err, docs) {
    if (err) {
      res.json({'ERROR': err});
    }
    
    res.json(docs);  
  });
}

module.exports = router;
