export default (h, w) => (container, data) => {
  var width = 960,
    height = 500,
    color = d3.scale.category20c();

  var treemap = d3.layout.treemap()
    .padding(4)
    .size([width, height])
    .value(function(d) { return d.size; });

  var svg = d3.select(container)
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")
    .attr("transform", "translate(-.5,-.5)");

  var cell = svg.data(data).selectAll("g")
    .data(treemap.nodes)
    .enter().append("g")
    .attr("class", "cell")
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  cell.append("rect")
    .attr("width", function(d) { return d.dx; })
    .attr("height", function(d) { return d.dy; })
    .style("fill", function(d) { return d.children ? color(d.name) : null; });

  cell.append("text")
    .attr("x", function(d) { return d.dx / 2; })
    .attr("y", function(d) { return d.dy / 2; })
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(function(d) { return d.children ? null : d.size; });
}
