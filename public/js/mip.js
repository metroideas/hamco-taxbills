var map     = window.map     || {};
var graphic = window.graphic || {};

(function(map, graphic) {
  var form = document.getElementById('address-lookup');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    var address = form.elements['address-field'].value;
    var errorField = document.getElementById('form-error-message');

    errorField.innerHTML = "";

    if (address) {
      locationLookup(address, function(err, loc) {
        if (err) {
          // Error handling
          return ;
        }

        if (loc.taxbills != undefined) {
          map.update(loc);
          graphic.update(loc); 
        } else {
          errorField.innerHTML = "Address not found. Please try another search."
        }
      })

      form.elements['address-field'].value = "";
    }
  });

  function locationLookup(address, cb) {
    var api = '/api/address/' + address;

    var request = new XMLHttpRequest();

    request.open('GET', api, true);

    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        var data = JSON.parse(this.response);
        cb(null, data);
      } else {
        // We reached our target server, but it returned an error
        // Error handling
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      // Error handling
    }

    request.send();
  }
})(map, graphic);

