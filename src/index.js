const $ = require('jquery');
const d3 = require('d3');

const sourceFiles = ['index.html', 'style.css', 'src/index.js']
const dataFiles = ['data/cscw.csv', 'data/hci.csv', 'data/se.csv'];

const renderTable = (rows) => {
  d3.select("body").append("table")
    .selectAll("tr").data(rows).enter().append("tr")
    .selectAll("td").data(d=>d).enter().append("td").text(d=>d)
}

const renderFile = path => code => {
  let container = $('<div>').append($('<h3>').text(path))
  container.append($('<pre>').text(code))
  $('body').append(container)
}

// Wait for document to load
$(() => {
  dataFiles.forEach(function(path) {
    d3.text(path, function(csv) {
      var rows = d3.csv.parseRows(csv);

      // Render the data table
      // renderTable(rows);

      // Render the charts and explanations
      let data = d3.csv.parse(csv)
      questions.forEach(function(q, i) {
        let container = $('<div>').addClass("question")
          .append($('<h2>').text(q.question))
        let svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        container.append($(svg).addClass('chart'))
        q.render(svg, data)
        container.append($('<p>').addClass('explanation').text(q.explanation))
        $('body').append(container);
      })
    });
  });

  // Render the source files
  // sourceFiles.forEach(path => d3.text(path, renderFile(path)));
})

let charts = [{
  render: (container, rawData) => {
  },
  explanation: ``,
},{
  render: (container, rawData) => {
  },
  explanation: ``,
}]
