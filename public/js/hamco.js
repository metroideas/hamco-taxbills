var map = window.map || {};

(function(map) {
  var
  pi         = Math.PI,
  tau        = pi * 2,
  container  = document.querySelector("#map"),
  breakpoint = 800,
  width      = +container.offsetWidth,
  height     = Math.round(width * 1.1),
  mobile     = width < breakpoint,
  maxZoom    = (1 << 26),
  minZoom    = (1 << 19) * (width / breakpoint)
  ;

  container.innerHTML = "";

  window.onload = draw();

  var projection = d3.geoMercator()
    .scale(1 / tau)
    .translate([0, 0]);

  var path = d3.geoPath()
    .projection(projection);

  var tile = d3.tile()
    .size([width, height]);

  var zoom = d3.zoom()
    .scaleExtent([minZoom, maxZoom])
    .on("zoom", zoomed);

  var svg = d3.select(container).append("svg")
    .attr("width", width)
    .attr("height", height)
    ;

  var mapTiles = svg.append("g")
    .attr("id", "map-tiles");

  var blockgroups = svg.append("g")
    .attr("id", "blockgroups");

  d3.select("#map").append("div")
    .attr("class", "attribution")
    .html('<a href="http://metroideas.org">Metro Ideas Project</a> | <a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a> | © <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>')

  map.update = function(data) {
    // Delete old marker
    // Pan and/or zoom map to coordinates
    // Place new marker
    // console.log(data.coordinates);
  }

  function draw() {
    d3.json("/js/hamco.topo.json", function(err, topology) {
      if (err) throw err;

      var data   = topojson.feature(topology, topology.objects.blockgroups);
      var bounds = d3.geoBounds(data);
      var center = projection([ ((bounds[0][0] + bounds[1][0]) / 2), ((bounds[0][1] + bounds[1][1]) / 2) ]);
      
      blockgroups.selectAll("path.blockgroup")
          .data(data.features)
        .enter().append("path")
          .attr("class", "blockgroup")
          .attr("d", path)
          .attr("fill", "none")
          ;

      svg
        .call(zoom)
        .call(zoom.transform, d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(minZoom)
          .translate(-center[0], -center[1])); 
    });
  }

  function zoomed() {
    var transform = d3.event.transform;

    var tiles = tile
      .scale(transform.k)
      .translate([transform.x, transform.y])
      ();

    blockgroups.selectAll("path.blockgroup")
      .attr("transform", transform)
      .style("stroke-width", 1 / transform.k)
      ;

    var image = mapTiles
        .attr("transform", stringify(tiles.scale, tiles.translate))
      .selectAll("image")
      .data(tiles, function(d) { return d; });

    image.exit().remove();

    image.enter().append("image")
      .attr("class", "tile")
      .attr("x", function(d) { return d[0] * 256; })
      .attr("y", function(d) { return d[1] * 256; })
      .attr("width", 256)
      .attr("height", 256)
      .attr("xlink:href", function(d) {
        var mapbox = {
          base:    "https://api.mapbox.com/styles/v1/mdavidmorton/",
          style:   "ciu5nfp4500eg2ipgdjbmflkw/",
          tileset: "tiles/256/",
          key:     "@2x?access_token=pk.eyJ1IjoibWRhdmlkbW9ydG9uIiwiYSI6ImNpZzN5cDZyNTI3czJ1c201cjlvMjh4OWQifQ.CGZjS_17LA9FrdS92dMUow",
          url: function(x,y,z) { return this.base + this.style + this.tileset + z + "/" + x + "/" + y + this.key; }
        }
        var x = d[0], y = d[1], z = d[2];
       
        return mapbox.url(x,y,z);
      });
  }

  function stringify(scale, translate) {
    var
    k = scale / 256,
    r = scale % 1 ? Number : Math.round
    ;

    return "translate(" + r(translate[0] * scale) + "," + r(translate[1] * scale) + ") scale(" + k + ")";
  }

})(map)