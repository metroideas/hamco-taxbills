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
  Summary.find({ _id: 'hamilton-county' }, function(err, summary) {
    if (err) return err;

    var data = JSON.stringify(summary[0]);

    res.render('index', { title: 'Hamilton County', data: data, subhead: 'Median appraisal in Hamilton County' });
  })
});

// Sample
router.get('/druid', function(req, res, next) {
  location('Eig1MTIgRHJ1aWQgTG4sIENoYXR0YW5vb2dhLCBUTiAzNzQwNSwgVVNB', function(err, loc) {
    if (err) redirect(req, res, '');

    if (!loc) redirect(req, res, 'No Location data for that address');

    var title = loc.formattedAddress.slice(0,-5);
    var subhead = "Annual appraisals for ".concat(title);
    var data = JSON.stringify(loc);

    var labels = [];

      for (var key in loc) {
        switch (key) {
          case 'county':
          case 'countyDistrict':
          case 'censusTract':
          case 'municipality':
          case 'zipcode':
            labels.push({ id: key, name: loc[key].name})
          default: ;
        }
      }

    res.render('index', { title: title, subhead: subhead, data: data, location: true, labels: labels.reverse() })
  })
})

module.exports = router;
