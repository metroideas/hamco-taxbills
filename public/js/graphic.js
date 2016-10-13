var graphic = window.graphic || {};

(function() {
  // Dimensions
  var
  container = document.querySelector("#graphic"),
  chart     = container.querySelector(".chart"),
  mobile    = (+container.offsetWidth <= 768),
  ratio     = (mobile) ? { width: 1, height: 2 } : { width: 8, height: 3 },
  margin    = {
    top: 32,
    right: 16,
    bottom: 32,
    left: (mobile) ? 32 : 40,
    width: function() { return this.right + this.left; },
    height: function() { return this.top + this.bottom; }
  },
  width     = +container.offsetWidth - margin.width(),
  height    = Math.round(width * (ratio.height / ratio.width) - margin.height())
  ;

  // Undefined variables
  var data;
  var max;
  var svg;

  /*
    Public methods:
    graphic.draw()
    graphic.update(result) 
    graphic.data(result)
  */
  graphic.draw = function() {
    var scales    = scale();
    var appraisal = scales.appraisal;
    var years     = scales.year;
    var axis      = scales.axis;
    
    // Initial setup
    chart.innerHTML = "";
    
    svg = d3.select(chart).append("svg")
        .attr("width", width + margin.width())
        .attr("height", height + margin.height())
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Draw axis and remove first axis label for zero
    svg.append("g")
      .attr("class", "axis")
      .call(axis);

    svg.select("g.axis g.tick:first-of-type text").remove();

    bargroups(appraisal, years);

    if (data.summaries) {
      summaries(appraisal, years);
    }
  }

  graphic.update = function(result) {
    graphic.data(result);
    graphic.draw();
  }

  // Sets data variables
  graphic.data = function(result) {
    data = result;

    // For location/non-summary data
    if (data.type != 'county') {
      data.summaries = function() {
        return [ data.county, data.municipality, data.countyDistrict, data.zipcode ]
      }();  
    }
    
    // Sets max value in scales
    max = function() {
      function compare(data, start) {
        var m = d3.max(data, function(d) { return median(d); });
        return (start > m) ? start : m;
      }
      // Initial
      var m = compare(data.taxbills, 0);

      for (var i in data) {
        if (data[i].taxbills) {
          m = compare(data[i].taxbills, m);
        }
      }
      
      return m;
    }();
  }

  function scale() {
    var year = d3.scaleBand()
      .domain(data.taxbills.map(function(d) { return d.year; }));

    var appraisal = d3.scaleLinear()
      .domain([0, max]);

    var axis;

    if (mobile) {
      year.range([0, height])
        .padding(0.1);

      appraisal.range([0, width]);

      axis = d3.axisTop(appraisal)
        .tickSize(-height, 0, 0);
    
    } else {
      year.range([0, width])
        .padding(0.25);

      appraisal.range([height, 0])

      axis = d3.axisLeft(appraisal)
        .tickSize(-width, 0, 0);
    }

    axis.tickArguments([4, d3.format("$.0s")]);

    return {
      year:      year,
      axis:      axis,
      appraisal: appraisal
    }
  }

  function median(d) {
    return d.appraisal.median || 0;
  }

  function summaries(appraisal, years) {
    var cont  = d3.select("#comparison-container")
      .classed("hidden", false);

    var inputs = cont.selectAll("p")
        .data(data.summaries)
      .enter().append("p");

    var labels = inputs.append("label");

    labels.html(function(d) {
      var checkbox = "<input type='checkbox' data-select='" +  d.type + "'> ";
      return checkbox + d.name;
    });

    d3.selectAll("input[type='checkbox']").on("change", function() {
      if (this.checked) {
          var type  = this.dataset.select;
          var datum = data.summaries.filter(function(d) {
            return d.type == type;
          })[0];

          // d3 line generator
          var line = d3.line()
            .x(function(d) { return (mobile) ? appraisal(median(d)) : years(d.year); })
            .y(function(d) { return (mobile) ? years(d.year) : appraisal(median(d)); });

          svg.append("path").attr("class", "summary " + type)
            .datum(datum.taxbills)
            .attr("d", line)
            .attr("transform", function(d) {
              var offset = years.bandwidth() / 2;
              
              return (mobile)
                ? "translate(0," + offset + ")"
                : "translate(" + offset + ",0)";
            });
        } else {
          var line = "path.summary." + this.dataset.select;
          d3.select(line).remove();
        }
    })
  }

  function bargroups(appraisal, years) {

    var bars = svg.append("g").attr("class", "bars")
      .selectAll("g.bar-group")
        .data(data.taxbills)
      .enter().append("g")
        .attr("class", "bar-group");

    bars.attr("transform", function(d) {
      return (mobile)
        ? "translate(0," + years(d.year) + ")"  // Vertical - "mobile"
        : "translate(" + years(d.year) + ",0)"; // Horizontal
    });

    var labels = bars.append("text")
      .attr("class", "label")
      .text(function(d) { return d.year; });

    // Bar groups: Orientation-based labels and rects
    if (mobile) {
      // Vertical orientation
      labels.attr("transform",
        "translate(" + -margin.left + "," + years.bandwidth() / 2 + ")")
        .attr("dominant-baseline", "middle");

      bars.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", years.bandwidth())
        .attr("width", function(d) { return appraisal(median(d)); })

    } else {
      // Horizontal orientation
      labels.attr("transform", function(d) {
        return "translate(" + years.bandwidth() / 2 + "," + (height + margin.bottom / 2) + ")"; })
        .attr("text-anchor", "middle");

      bars.append("rect")
        .attr("x", 0)
        .attr("y", function(d) { return appraisal(median(d)); })
        .attr("height", function(d) { return height - appraisal(median(d)); })
        .attr("width", years.bandwidth())
        //.call(hover) // Mouseover tooltip on horizontal orientation only
        ;
    }
  }
})();

