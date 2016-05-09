export default (h, w) => (container, data) => {
  var r = Math.min(w, h) / 2,
    color = d3.scale.category20b();

  var vis = d3.select(container)
    .attr("width", w)
    .attr("height", h)
    .append("svg:g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

  var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, r * r])
    .value(function(d) { return d.size; });

  var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

    var path = vis.data(data).selectAll("path")
      .data(partition.nodes)
      .enter().append("svg:path")
      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      .attr("d", arc)
      .attr("fill-rule", "evenodd")
      .style("stroke", "#fff")
      .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
}
