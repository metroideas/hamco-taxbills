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

    new mapboxgl.Marker(marker, { offset: [-25, -25] })
      .setLngLat(location.coordinates)
      .addTo(this);
  }

  return map;
})(map);


