import sunburst from  './sunburst';
import treemap from  './treemap';

const $ = require('jquery');
const d3 = require('d3');

const sourceFiles = [
  'index.html',
  'style.css',
  'src/sunburst.js',
  'src/treemap.js',
  'src/index.js',
]
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
  let container = $('<div>').addClass('break-after').append($('<h3>').text(path))
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
        let container = $('<div>')
          .addClass('break-after')
          .append($('<h2>').addClass('chart-title').text(chart.title(dataFile)))
        chart.render(container, prep(rows))
        $('body').append(container);
      })
    });
  });

  setTimeout(function() {
    // Render remarks
    $('body').append($('<div>').addClass('break-after').html(remarks()));

    // Render the source files
    sourceFiles.forEach(path => d3.text(path, renderFile(path)));
  },1000)

})

const prep = (rows) => {
  return [{
    name: '',
    children: rows.map(row => {
      return {
        name: row[0],
        children: row.slice(1, row.length-1)
          .filter(i => i.length > 0)
          .map(i=>{
            return {
              name: 'Anonymous Faculty',
              size: +i
            }
          })
      }
    })
  }]
}

let h = 1000;
let w = 1000;

let charts = [{
  title: df => `${df.title} Sunburst`,
  render: function(container, data) {
    let svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    $(container).append($(svg));
    sunburst(h,w)(svg, data);
  },
  explanation: `
  <p>This visualization (sunburst) allows the viewer to quickly pick out
  which schools are the most high impact relative to each other as
  well as pick out which faculty are highest impact relative to each
  other. Color is used to distinguish one school from another. The
  same color is used for each faculty member of a school in order
  to make it easy to keep in mind which school's faculty is being
  viewed.</p>

  <p>I chose this visualization because I feel that the data is in
  fact heirarchical in nature and given that the viewer wants to
  view the whole as well as the sum of its parts 
  (the school as the faculty members), the sunburst was appropriate.</p>
  `,
  },{
  title: df => `${df.title} Treemap`,
    render: function(container, data) {
      let svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
      $(container).append($(svg));
      treemap(h,w)(svg, data)
    },
    explanation: `
    <p>This visualization (treemap), similar to the sunburst, works
    well with this type of nested data. The choice of colors are
    also simply for separating out the schools, which make up the
    main blocks (first level) of the tree map. The faculty members
    make up the second level, with their size a function of their
    individual impact. Naturally, the size of the parent (the school)
    is a function of all the individual impacts of the faculty.</p>

      <p>I chose this visualization because it was another way to view
    heirarchical data. In the treemap we can still view the whole
    as well as the sum of its parts. I was also curious how different
    the treemap and the sunburst would be in reprenting exactly
    the same data and structure.</p>
    `,
}]

function remarks() {
  return `
  <p>I chose to create a treemap and a sunburst.</p>

  ${charts.map(
    c =>`<h3>${c.title({title:''})}</h3>${c.explanation}`
  ).join('\n')}

  <h3>Which is better?</h3>

  <p>I believe the sunburst is a superior visualization for this dataset. There are two reasons why I think this:</p>

  <ol>
  <li>Viewer can look at one level (inner circle) and then look at the next level only if necessary whereas with a treemap you are given all data at once and it is not obvious to the eyes to separate one level from another. It takes more effort to "ignore" the extra data in a treemap than a sunburst, in my opinion.</li>

  <li>The sunburst is easier to determine relative sizes of not only the schools but the individual faculty. The elements that are too small to matter are accurately represented as such with a smaller cross-section in one dimention. In contrast, the treemap takes up space in two dimensions for the same node, which only distracts the viewer when trying to make comparisons.</li>
  </ol>
  `
}
