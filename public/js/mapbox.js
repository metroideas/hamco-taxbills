var map = window.map || {};

(function() {
  // Clear fallback img
  var img = document.querySelector("#map img");
  img.parentNode.removeChild(img);
  // Map bounds set to SW and NE corners of Hamilton County, Tennessee
  var bounds = [[-85.475593,34.982924],[-84.942572,35.459261]];
  // API key
  mapboxgl.accessToken = 'pk.eyJ1IjoibWRhdmlkbW9ydG9uIiwiYSI6ImNpZzN5cDZyNTI3czJ1c201cjlvMjh4OWQifQ.CGZjS_17LA9FrdS92dMUow';
  // Set map object
  map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mdavidmorton/ciu5nfp4500eg2ipgdjbmflkw'
  });
  // Map settings
  map.fitBounds(bounds);
  map.addControl(new mapboxgl.NavigationControl());

  /*
    map.update expects location data
  */
  map.update = function(location) {
    // Zoom to location coordinates
    this.flyTo({
      center: location.coordinates,
      zoom: 13
    });

    // Remove any existing markers
    var old = document.getElementById('marker')
    
    if (old) {
      old.parentNode.removeChild(old);
    }

    // Add new map marker to DOM
    var marker = document.createElement('div');
    marker.id = 'marker';

    // Formats median appraisal string from given taxbills array
    function appraisal(taxbills) {
      var median = taxbills.filter(function(d) {
        return d.year == '2016'
      })[0].appraisal.median;

      return d3.format("$,")(median); // Requires d3 formatter
    }

    // Marker popup
    var current = appraisal(location.taxbills);
    var census  = appraisal(location.censusBlockGroup.taxbills);
    var zipcode = appraisal(location.zipcode.taxbills);
    
    // Popup HTML
    var html = '<h4>2016 appraisals</h4>' +
      '<ul>' +
        '<li>Location: ' + current + '</li>' +
        '<li>Census median: ' + census + '</li>' +
        '<li>ZIP code median: ' + zipcode + '</li>' + 
      '</ul>';

    // Creates popup
    var popup = new mapboxgl.Popup({offset: [0, -30]})
      .setHTML(html);

    // Marker placement with popup
    new mapboxgl.Marker(marker)
      .setLngLat(location.coordinates)
     .setPopup(popup)
      .addTo(this);
  }

  return map;
})(map);


