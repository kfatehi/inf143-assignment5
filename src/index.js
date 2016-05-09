const $ = require('jquery');
const d3 = require('d3');

const sourceFiles = ['index.html', 'style.css', 'src/index.js']
const dataFiles = [{
  title: 'CSCW',
  path: 'data/cscw.csv',
},{
  title: 'HCI',
  path: 'data/hci.csv',
},{
  title: 'SE',
  path: 'data/se.csv'
}];

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
  dataFiles.forEach(function(dataFile) {
    d3.text(dataFile.path, function(csv) {
      var rows = d3.csv.parseRows(csv);

      // Render the data table
      // renderTable(rows);

      // Render the charts and explanations
      charts.forEach(function(chart, i) {
        let container = $('<div>').addClass("chart")
          .append($('<h2>').text(dataFile.title+' -- '+chart.title))
        let svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        container.append($(svg).addClass('chart'))
        chart.render(svg, prep(rows))
        container.append($('<p>').addClass('explanation').text(chart.explanation))
        $('body').append(container);
      })
    });
  });

  // Render the source files
  // sourceFiles.forEach(path => d3.text(path, renderFile(path)));
})

const prep = (rows) => {
  return rows.map(row => {
    const school = row[0];
    const contribs = row.slice(1, row.length-1)
      .filter(i => i.length > 0)
      .map(i=>+i);
    return { school, contribs }
  });
}

let charts = [{
  title: 'chart 1',
  render: (container, data) => {
    console.log(data);
  },
  explanation: ``,
},{
  title: 'chart 2',
  render: (container, data) => {
  },
  explanation: ``,
}]
