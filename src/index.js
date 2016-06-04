const $ = require('jquery');
const d3 = require('d3');
import plot from './scatterplot';
//import plot from './linegraphV2';

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

  let infoMap = {
    'volatile acidity':'a measure of the total concentration of \'volatile acids\' in wine. While there are a number of wine acids that are volatile, the most serious one is acetic acid, which accounts for over 95% of any VA measurement.',
    'citric acid':'a weak organic tribasic acid having the chemical formula C₆H₈O₇. It occurs naturally in citrus fruits.',
    'residual sugar':'any natural grape sugars that are leftover after fermentation ceases',
    'chlorides':'is formed when the element chlorine (a halogen) gains an electron or when a compound such as hydrogen chloride is dissolved in water or other polar solvents.',
    'free sulfur dioxide':'Sulfur dioxide (SO2) is important in the winemaking process as it aids in preventing microbial growth and the oxidation of wine.',
    'total sulfur dioxide':'a measure of both the free and bound forms of SO2. Bound SO2 refers to SO2 molecules that are bonded to other compounds, primarily aldehydes, pyruvate, and anthocyanins.',
    'density':'degree of consistency measured by the quantity of mass per unit volume.',
    'pH':'the negative of the base-10 log of the activity of the hydrogen ion in an aqueous solution. Solutions with a pH less than 7 are acidic and solutions with a pH greater than 7 are basic or alkaline. Pure water has a pH of 7.',
    'sulphates':'an anti-inflammatory and anti-depressant. It is needed for making stomach acid and digestive enzymes, so that we can break down the food we eat into useful components.',
    'alcohol':'an intoxicating ingredient found in beer, wine, and liquor. Alcohol is produced by the fermentation of yeast, sugars, and starches. It is a central nervous system depressant that is rapidly absorbed from the stomach and small intestine into the bloodstream.',
  }

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

      let table = $('<table>');

      table.append(colNames.slice(1, colNames.length-1).map(function(name, idx) {


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
            quality: +row[outputIdx],
            metric: +row[idx], 
          }
        }).sort(function(a,b) {
          return a.metric - b.metric;
        });

        let data = redData.concat(whiteData);


        let description = infoMap[name];
        let button = $('<button>').click(function() {
          container.empty();
          plot(container.get(0), data, name, {
            colorMap: {
              "Red": `rgba(${230},${16},${69}, 0.8)`,
              "White": `rgba(${230},${222},${16}, 0.4)`,
            }
          });
        }).text(name)

        let tr = $('<tr>');

        return tr.append(
          $('<td>').append(button),
          $('<td>').append(description)
        );
      }));
      $('body').append(table).append(container);

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

