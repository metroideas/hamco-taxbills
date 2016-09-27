(function(window, document, d3, data) {
  // Replace fallback image with dynamic graphic if d3 library is present
  if (d3) {
    window.onload = draw;
    window.onresize = draw;  
  }
  
  function draw() {
    var container = document.querySelector("#graphic")
    var chart = container.querySelector(".chart");
    
    // Container size boolean flips orientation
    var mobile = (+container.offsetWidth <= 768);

    // Dimensions
    // ---------------------------------------------------------------------------
    // Conventional margins
    var margin = {
      top: 32,
      right: 16,
      bottom: 32,
      left: (mobile) ? 32 : 40,
      width: function() { return this.right + this.left; },
      height: function() { return this.top + this.bottom; }
    };

    // Aspect ratio
    var ratio  = (mobile) ? { width: 1, height: 2 } : { width: 8, height: 3 };

    // Chart width minus left/right margin
    var width = function() {
      return +container.offsetWidth - margin.width();
    }();

    // Chart height minus top/bottom margin
    var height = function() {
      var f = ratio.height / ratio.width;

      return Math.round(width * f - margin.height());
    }();

    // Orientation-based scales and axes
    var yearScale = d3.scaleBand()
        .domain(data.taxbills.map(function(d) { return d.year; }));

    var appraisalScale = d3.scaleLinear()
        .domain([0, d3.max(data.taxbills, function(d) { return d.appraisal; })]);

    if (mobile) {
      yearScale.range([0, height])
        .padding(0.1);

      appraisalScale.range([0, width]);

      var axis = d3.axisTop(appraisalScale)
        
        .tickSize(-height, 0, 0)
    } else {
      yearScale.range([0, width])
        .padding(0.25);

      appraisalScale.range([height, 0])

      var axis = d3.axisLeft(appraisalScale)
        .tickSize(-width, 0, 0);
    }

    axis.tickArguments([4, d3.format("$.0s")]);
    
    // Chart setup
    chart.innerHTML = "";

    var svg = d3.select(chart).append("svg")
        .attr("width", width + margin.width())
        .attr("height", height + margin.height())
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Draw axis
    svg.append("g")
      .attr("class", "axis")
      .call(axis);

    svg.select("g.axis g.tick:first-of-type text").remove();

    // Bar groups binded to taxbill data
    var bars = svg.append("g").attr("class", "bars")
      .selectAll("g.bar-group")
        .data(data.taxbills)
      .enter().append("g")
        .attr("class", "bar-group");

    // Placement transform: Has to occur before label assignment
    bars.attr("transform", function(d) {
      return (mobile)
        ? "translate(0," + yearScale(d.year) + ")"  // Vertical
        : "translate(" + yearScale(d.year) + ",0)"; // Horizontal
    });

    var labels = bars.append("text")
      .attr("class", "label")
      .text(function(d) { return d.year; });

    // Bar groups: Orientation-based labels and rects
    if (mobile) {

      labels.attr("transform",
        "translate(" + -margin.left + "," + yearScale.bandwidth() / 2 + ")")
        .attr("dominant-baseline", "middle");

      bars.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", yearScale.bandwidth())
        .attr("width", function(d) { return appraisalScale(d.appraisal); })

    } else {

      labels.attr("transform", function(d) {
        return "translate(" + yearScale.bandwidth() / 2 + "," + (height + margin.bottom / 2) + ")"; })
        .attr("text-anchor", "middle");

      bars.append("rect")
        .attr("x", 0)
        .attr("y", function(d) { return appraisalScale(d.appraisal); })
        .attr("height", function(d) { return height - appraisalScale(d.appraisal); })
        .attr("width", yearScale.bandwidth());

    }
  }
  
})(window, document, d3, data);
