var express = require('express');
var router = express.Router();
var Address = require('../models/address');

router.get('/coordinates', function(req, res, next) {
  badRequest(req, res);
});

router.get('/coordinates/:lng/:lat', function(req, res, next) {
  findAddressByCoordinates(req, res);
});

function badRequest(req, res) {
  res.status(400).send('Bad Request');
}

function findAddressByCoordinates(req, res) {
  var lng = +req.params.lng;
  var lat = +req.params.lat
  
  Address.find({ coordinates: [lng, lat] }).exec(function(err, docs) {
    if (err) {
      res.json({'ERROR': err});
    }
    
    res.json(docs);  
  });
}

module.exports = router;
