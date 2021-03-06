export default (container, data, qualityName, {colorMap}) => {

  var dataGroup = d3.nest()
    .key(function(d) {return d.type;})
    .entries(data);
  var color = d3.scale.category10();
  var WIDTH = 1000,
      HEIGHT = 500,
      MARGINS = {
        top: 50,
        right: 20,
        bottom: 50,
        left: 50
      };

  var vis = d3.select(container).append('svg')
    .attr("width", WIDTH)
    .attr("height", HEIGHT);


      var lSpace = WIDTH/dataGroup.length,
  xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(data, function(d) {
    return d.metric;
  }), d3.max(data, function(d) {
    return d.metric;
  })]),
         yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(data, function(d) {
           return d.quality;
         }), d3.max(data, function(d) {
           return d.quality;
         })]),
         xAxis = d3.svg.axis()
           .scale(xScale),
         yAxis = d3.svg.axis()
           .scale(yScale)
           .orient("left");

  vis.append("svg:g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
    .call(xAxis);
  vis.append("svg:g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (MARGINS.left) + ",0)")
    .call(yAxis);

  var lineGen = d3.svg.line()
    .x(function(d) {
      return xScale(d.metric);
    })
  .y(function(d) {
    return yScale(d.quality);
  })
  .interpolate("basis");
  dataGroup.forEach(function(d,i) {
    vis.append('svg:path')
    .attr('d', lineGen(d.values))
    .attr('stroke', colorMap[d.key])
    .attr('stroke-width', 2)
    .attr('id', 'line_'+d.key)
    .attr('fill', 'none');
  vis.append("text")
    .attr("x", (lSpace/2)+i*lSpace)
    .attr("y", HEIGHT)
    .style("fill", "black")
    .attr("class","legend")
    .on('click',function(){
      var active   = d.active ? false : true;
      var opacity = active ? 0 : 1;
      d3.select("#line_" + d.key).style("opacity", opacity);
      d.active = active;
    })
  .text(qualityName);
  });

}
