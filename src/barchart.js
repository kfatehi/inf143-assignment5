var d3 = require('d3');

module.exports = {
  render: function(container, config) {

    var values = config.data.map(d => d.value)
    var max = d3.max(values)
    var scale = d3.scale.linear().domain([0, max])
    var bgColor = d3.scale.linear().domain([0, max]).range(['#FF393E', '#74FF63'])
    var txtColor = d3.scale.linear().domain([0, max]).range(['#023100', '#360000'])

    d3.select(container)
    .selectAll("div")
    .data(config.data)
    .enter().append("div")
    .style("width", d => `${scale(d.value) * 100}%`)
    .style("background-color", d => bgColor(d.value))
    .style("color", d => txtColor(d.value))
    .style("margin", '1px')
    .style('padding', '5px')
    .text(d => `${d.name} (${d.value})`);
  }
}
