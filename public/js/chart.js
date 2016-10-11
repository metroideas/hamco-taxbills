(function(window, document, d3, data) {
  if (d3) {
    window.onload = draw();
    window.onresize = draw();  
  }
  
  function draw() {
    var
    container = document.querySelector("#graphic"), // Visualization parent
    chart     = container.querySelector(".chart"),  // SVG parent
    mobile    = (+container.offsetWidth <= 768), // Container size boolean flips chart orientation
    location  = (data.type == null), // Data type boolean indicates that data is a Location result
    ratio     = (mobile) ? { width: 1, height: 2 } : { width: 8, height: 3 },
    margin    = {
      top: 32,
      right: 16,
      bottom: 32,
      left: (mobile) ? 32 : 40,
      width: function() { return this.right + this.left; },
      height: function() { return this.top + this.bottom; }
    },
    width     = +container.offsetWidth - margin.width(), // Chart width
    height    = Math.round(width * (ratio.height / ratio.width) - margin.height()) // Chart height
    ;

    /*
      Some Location API results will have fewer years of tax data than expected. 
      Placeholder data is added for those instances to ensure consistent comparisons and layout
    */
    if (location && data.taxbills.length != data.county.taxbills.length) {
      var placeholders = data.county.taxbills.map(function(d) { return { year: d.year }; })
      var bills = data.taxbills;
      
      placeholders = placeholders.filter(function(p) {
        return !bills.find(function(b) {
          return b.year == p.year;
        })
      })

      data.taxbills = bills.concat(placeholders).sort(function(a,b) {
        return a.year - b.year;
      })

      placeholders = bills = null;
    }

    /*
      Locations with low property values may result in graphics that push summary lines (e.g. countywide)
      out of the SVG's range. This function queries each summary taxbills array and returns the highest value
      for the linear (dollar amount) scale
    */
    // Check summary taxbills for highest appraisal value
    var max = function() {
      function compare(data, start) {
        var m = d3.max(data, function(d) { return d.appraisal.median; });
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

    /*
      Orientation-based scales and axes
      Default values are initially set, followed by conditional x/y settings determined by the mobile boolean
    */
    
    var yearScale = d3.scaleBand()
        .domain(data.taxbills.map(function(d) { return d.year; }));

    var appraisalScale = d3.scaleLinear()
        .domain([0, max]);

    if (mobile) {
      yearScale.range([0, height])
        .padding(0.1);

      appraisalScale.range([0, width]);

      var axis = d3.axisTop(appraisalScale)
        .tickSize(-height, 0, 0);

    } else {
      yearScale.range([0, width])
        .padding(0.25);

      appraisalScale.range([height, 0])

      var axis = d3.axisLeft(appraisalScale)
        .tickSize(-width, 0, 0);
    }

    axis.tickArguments([4, d3.format("$.0s")]);
    
    /*
      Initial chart setup
      
      Inner HTML is cleared each time draw() is called. This will remove any placeholder images on page load
      and add "responsive" behavior on resize

      The svg variable is the parent of all SVG elements, and is made "responsive" by dynamic width/height variables above

      To Do: Needs title and description copy
    */
    chart.innerHTML = "";

    var svg = d3.select(chart).append("svg")
        .attr("width", width + margin.width())
        .attr("height", height + margin.height())
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Draw axis and remove first axis label for zero
    svg.append("g")
      .attr("class", "axis")
      .call(axis);

    svg.select("g.axis g.tick:first-of-type text").remove();

    /*
      Bar groups are binded to the primary taxbills array and contain both rect and text (label) elements

      Other than the placement transform, the initial values are defaults, followed by vertical/horizontal
      orientation specific values

      Only the horizontal orientation includes the mouseover tooltip
    */
    var bars = svg.append("g").attr("class", "bars")
      .selectAll("g.bar-group")
        .data(data.taxbills)
      .enter().append("g")
        .attr("class", "bar-group");

    // Placement transform: Has to occur before label append
    bars.attr("transform", function(d) {
      return (mobile)
        ? "translate(0," + yearScale(d.year) + ")"  // Vertical - "mobile"
        : "translate(" + yearScale(d.year) + ",0)"; // Horizontal
    });

    var labels = bars.append("text")
      .attr("class", "label")
      .text(function(d) { return d.year; });

    // Bar groups: Orientation-based labels and rects
    if (mobile) {
      // Vertical orientation
      labels.attr("transform",
        "translate(" + -margin.left + "," + yearScale.bandwidth() / 2 + ")")
        .attr("dominant-baseline", "middle");

      bars.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", yearScale.bandwidth())
        .attr("width", function(d) { return appraisalScale(d.appraisal.median); })

    } else {
      // Horizontal orientation
      labels.attr("transform", function(d) {
        return "translate(" + yearScale.bandwidth() / 2 + "," + (height + margin.bottom / 2) + ")"; })
        .attr("text-anchor", "middle");

      bars.append("rect")
        .attr("x", 0)
        .attr("y", function(d) { return appraisalScale(d.appraisal.median); })
        .attr("height", function(d) { return height - appraisalScale(d.appraisal.median); })
        .attr("width", yearScale.bandwidth())
        .call(hover); // Mouseover tooltip on horizontal orientation only
    }

    /*
      Shows or hides a tooltip based on mouseover and mouseout events
      The tooltip has dynamic text values for year, appraisal, county and municipality
    */
    function hover(bar) {
      bar
        .on("mouseover", function(d) {
          // Change rect properties
          // d3.select(this).attr(/* ... */)

          var tooltip = d3.select("#tooltip").classed("hidden", false);
          var dollar = d3.format("$,");
          
          tooltip.select("#year").html(d.year);
          tooltip.select("#appraisal-amount").html(dollar(d.appraisal.median));
          tooltip.select("#county-amount").html(dollar(d.county.median));
          tooltip.select("#municipality-amount").html(dollar(d.municipality.median));

          var matrix = this.getCTM()
              .translate(+ this.getAttribute("cx"), + this.getAttribute("cy"));

          tooltip.style("left", function() {
            var
            w      = +tooltip.style("width").slice(0, -2),
            left   = d3.event.pageX - w / 2,
            adjust
            ;

            // Slide tooltips away from edges
            if (matrix.e <= width * .25) {
              adjust = (width - matrix.e) / width;
              left += adjust * w / 2;
            } else if (matrix.e >= width * .75) {
              adjust = 1 - (width - matrix.e) / width;
              left -= adjust * w / 2;
            }

            return left + "px";
          });

          tooltip.style("top", function() {
            var h   = +tooltip.style("height").slice(0, -2);
            var top = d3.event.pageY;
            
            top = (matrix.f >= height * .5) ? top - h * 1.5 : top + 15;
            
            return top + "px";
          });
        })
        .on("mouseout", function() {
          d3.select("#tooltip").classed("hidden", true);
        })
    }

    /*
      Summary lines for location comparison
      These are toggled by checkbox inputs in the DOM to add or remove lines for comparing a 
      property's annual taxbills to summary median values
    */
    if (location) {
      d3.selectAll("input[type='checkbox']").on("change", function() {
      
        if (this.checked) {
          var type = this.id;
          // d3 line generator
          var line = d3.line()
            .x(function(d) { return (mobile) ? appraisalScale(d.appraisal.median) : yearScale(d.year); })
            .y(function(d) { return (mobile) ? yearScale(d.year) : appraisalScale(d.appraisal.median); });


          svg.append("path").attr("class", "summary " + type)
            .datum(data[type].taxbills)
            .attr("d", line)
            .attr("transform", function(d) {
              var offset = yearScale.bandwidth() / 2;
              
              return (mobile)
                ? "translate(0," + offset + ")"
                : "translate(" + offset + ",0)";
            });
        } else {
          var line = "path.summary." + this.id;
          d3.select(line).remove();
        }
      })
    }

    // End of draw()
  }
})(window, document, d3, data);
