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
    .value(function(d) { return d.size; })

  var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

  let arcs = vis.data(data).selectAll("path")
    .data(partition.nodes)
    .enter()

  arcs
    .append("svg:path")
    .attr("display", d => d.depth ? null : "none") // hide inner ring
    .attr("d", arc)
    .attr("fill-rule", "evenodd")
    .style("stroke", "#fff")
    .style("fill", d => color((d.children ? d : d.parent).name))


  // source: http://stackoverflow.com/questions/22622381/how-to-position-text-labels-on-a-sunburst-chart-with-d3-js
  function getAngle(d) {
    // Offset the angle by 90 deg since the '0' degree axis for arc is Y axis, while
    // for text it is the X axis.
    var thetaDeg = (180 / Math.PI * (arc.startAngle()(d) + arc.endAngle()(d)) / 2 - 90);
    // If we are rotating the text by more than 90 deg, then "flip" it.
    // This is why "text-anchor", "middle" is important, otherwise, this "flip" would
    // a little harder.
    return (thetaDeg > 90) ? thetaDeg - 180 : thetaDeg;
  }

  // Labels
  arcs
    .append('text')
    .attr("transform", d => {
      return `translate(${arc.centroid(d)}),rotate(${getAngle(d)})`;
    })
    .attr("text-anchor", "middle")
    .text(d => d.children ? d.name : d.size)
}
