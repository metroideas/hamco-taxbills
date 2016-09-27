var express = require('express');
var geocoder = require('../controllers/geocoder');
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

// Geocode input address, call location api and render view
router.post('/', function(req, res, next) {
  var userAddress = req.body.userAddress;

  // input validation before geocoder call
  if (!userAddress) {
    redirect(req, res, 'No address entered');
    return ;
  }

  geocoder(userAddress, function(err, geo) {
    if (err) {
      redirect(req, res, 'Error');
    }

    if (!geo) {
      redirect(req, res, 'No response from geocoder');
    }

    location(geo, function(err, loc) {
      if (err) redirect(req, res, '');

      if (!loc) redirect(req, res, 'No Location data for that address');

      res.render('index', { title: loc.formattedAddress.slice(0,-5), data: JSON.stringify(loc) })
    })
  })
})

module.exports = router;
