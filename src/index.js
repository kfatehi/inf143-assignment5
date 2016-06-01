const $ = require('jquery');
const d3 = require('d3');
import plot from './scatterplot';

const sourceFiles = [
  'src/index.js',
  'src/scatterplot.js',
]
const dataFiles = [{
  title: 'Red Wine',
  path: 'data/winequality-red.csv',
},{
  title: 'White Wine',
  path: 'data/winequality-white.csv',
}];

const renderTable = (rows) => {
  d3.select("body").append("table")
    .selectAll("tr").data(rows).enter().append("tr")
    .selectAll("td").data(d=>d).enter().append("td").text(d=>d)
}

const renderFile = path => code => {
  let container = $('<div>').addClass('break-after').append($('<h3>').text(path))
  container.append($('<pre>').text(code))
  $('body').append(container)
}

// Wait for document to load
$(() => {
  let container = $('<div>').addClass('chart-container');
  dataFiles.forEach(function(dataFile) {
    d3.text(dataFile.path, function(csv) {
      let dsv = d3.dsv(';', 'text/plain');
      let rows = dsv.parseRows(csv);
      let dataRows = rows.slice(1, rows.length);
      let cols = rows[0];
      let outputIdx = cols.length-1;
      $('body').append(cols.slice(1, cols.length-1).map(function(name, idx) {
        return $('<button>').text(name).click(function() {

          let data = dataRows.map(row => {
            return {
              quality: row[outputIdx],
              metric: row[idx], 
            }
          }).sort(function(a,b) {
            return a.metric - b.metric;
          });

          container.empty();
          plot(container.get(0), data);
        });
      }));
      $('body').append(container);
    });
  });

  setTimeout(function() {
    function remarks() {
      return `
      <p>I chose to create a *name of vis* and this is the *brief explanation*.</p>
    `
    }
    $('body').append($('<div>').html(remarks()));

    // Render the source files
    sourceFiles.forEach(path => d3.text(path, renderFile(path)));
  },1000)

})

