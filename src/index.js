const $ = require('jquery');
const d3 = require('d3');
//import plot from './scatterplot';
import plot from './linegraphV2';

const sourceFiles = [
  'src/index.js',
  'src/scatterplot.js',
]

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

  let dsv = d3.dsv(';', 'text/plain');
  d3.text('data/winequality-red.csv', function(redsCsv) {
    let AllRedRows = dsv.parseRows(redsCsv);
    let redDataRows = AllRedRows.slice(1, AllRedRows.length);

    let colNames = AllRedRows[0]; // same for both
    let outputIdx = colNames.length-1;

    d3.text('data/winequality-white.csv', function(whitesCsv) {
      let AllWhiteRows = dsv.parseRows(whitesCsv);
      let whiteDataRows = AllWhiteRows.slice(1, AllRedRows.length);


      $('body').append(colNames.slice(1, colNames.length-1).map(function(name, idx) {


        let redData = redDataRows.map(row => {
          return {
            type: 'Red',
            quality: row[outputIdx],
            metric: row[idx], 
          }
        }).sort(function(a,b) {
          return a.metric - b.metric;
        });

        let whiteData = whiteDataRows.map(row => {
          return {
            type: 'White',
            quality: row[outputIdx],
            metric: row[idx], 
          }
        }).sort(function(a,b) {
          return a.metric - b.metric;
        });

        let data = redData.concat(whiteData);




        return $('<button>').text(name).click(function() {
          container.empty();
          plot(container.get(0), data, name, {
            colorMap: {
              "Red": `rgba(${230},${16},${69}, 0.8)`,
              "White": `rgba(${230},${222},${16}, 0.9)`,
            }
          });
        });
      }));
      $('body').append(container);

    })
  })


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

