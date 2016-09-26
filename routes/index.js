var express = require('express');
var coordinates = require('../controllers/coordinates');
var location = require('../controllers/location');
var Summary = require('../models/summary');
var router = express.Router();

// redirect shorthand with flash message
function redirect(req, res, message) {  
  res.redirect('/')
}

/* GET home page. */
router.get('/', function(req, res, next) {
  Summary.find({ _id: 'hamilton-county' }, function(err, data) {
    if (err) return err;

    res.render('index', { title: 'Hamilton County', data: data });
  })
});

// Geocode input address, call coordinates api and render view
router.post('/', function(req, res, next) {
  var userAddress = req.body.userAddress;

  // input validation before geocoder call

  if (userAddress) {
    coordinates(userAddress, function(err, coordinates) {
      if (err) redirect(req, res, 'Error');

      if (coordinates) {
        location(coordinates, function(err, location) {
          if (err) redirect(req, res, '');
          
          if (location == {}) {
            redirect(req, res, 'No Location data for that address');
          } else {
            // Successful request
            res.render('index', { title: coordinates, userAddress: userAddress })
            // res.render('index', { title: location.formattedAddress.slice(0, -5) })  
          }
        })
      } else {
        redirect(req, res, 'Geocoder error');
      }
        
    })
  } else {
    redirect(req, res, 'No address entered')
  }
})

module.exports = router;
