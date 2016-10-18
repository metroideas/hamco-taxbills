var map = window.map || {};

(function() {
  var bounds = [[-85.475593,34.982924],[-84.942572,35.459261]];

  mapboxgl.accessToken = 'pk.eyJ1IjoibWRhdmlkbW9ydG9uIiwiYSI6ImNpZzN5cDZyNTI3czJ1c201cjlvMjh4OWQifQ.CGZjS_17LA9FrdS92dMUow';

  map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mdavidmorton/ciu5nfp4500eg2ipgdjbmflkw'
  });

  map.fitBounds(bounds);

  map.addControl(new mapboxgl.NavigationControl());

  map.update = function(location) {
    // Zoom to location coordinates
    this.flyTo({
      center: location.coordinates,
      zoom: 13
    });

    // Remove existing marker
    var old = document.getElementById('marker')
    
    if (old) {
      old.parentNode.removeChild(old);
    }

    // Create map marker
    var marker = document.createElement('div');
    marker.id = 'marker';

    // Create popup, add to marker
    // Gets recent median appraisal and formats string 
    function appraisal(taxbills) {
      var median = taxbills.filter(function(d) {
        return d.year == '2016'
      })[0].appraisal.median;

      return d3.format("$,")(median);
    }

    var current = appraisal(location.taxbills);
    var census  = appraisal(location.censusBlockGroup.taxbills);
    var zipcode = appraisal(location.zipcode.taxbills);
    
    var html = '<h4>2016 appraisals</h4>' +
      '<ul>' +
        '<li>Location: ' + current + '</li>' +
        '<li>Census median: ' + census + '</li>' +
        '<li>ZIP code median: ' + zipcode + '</li>' + 
      '</ul>';

    var popup = new mapboxgl.Popup({offset: [0, -30]})
      .setHTML(html);

    new mapboxgl.Marker(marker)
      .setLngLat(location.coordinates)
     .setPopup(popup)
      .addTo(this);
  }

  return map;
})(map);


