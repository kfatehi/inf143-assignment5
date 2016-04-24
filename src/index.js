const $ = require('jquery');
const d3 = require('d3');
  
let questions = [{
  question: "1. Frequency/counting: How many students are in each major (in this class)?",
  render: (container, rawData) => {
    let majors = {}
    let majorData = [];
    rawData.forEach(d => majors[d.Major] ?  majors[d.Major] ++ : majors[d.Major] = 1)
    Object.keys(majors).forEach(name => majorData.push({ value: majors[name], name: name }))
    let data = majorData.sort((a, b) => a.name.localeCompare(b.name))
    let values = data.map(d => d.value)
    let max = d3.max(values)
    let scale = d3.scale.linear().domain([0, max])
    let bgColor = d3.scale.linear().domain([0, max]).range(['#FF393E', '#74FF63'])
    let txtColor = d3.scale.linear().domain([0, max]).range(['#023100', '#360000'])
    d3.select(container)
    .selectAll("div")
    .data(data)
    .enter().append("div")
    .style("width", d => `${scale(d.value) * 100}%`)
    .style("background-color", d => bgColor(d.value))
    .style("color", d => txtColor(d.value))
    .style("margin", '1px')
    .style('padding', '5px')
    .text(d => `${d.name} (${d.value})`);
  },
  explanation: `
  This graphic allows the user to determine how many students are in each major.
  It does this well given the fact that it clearly labels the number of students beside the major.
  Also, by using color and bar size it allows the viewer to determine which majors are more or less popular.
  Finally, by sorting in alphabetical order, the viewer can quickly scan to the major of interest.
  `,
},{
  question: "2. Did major have any affect on the score? Which majors scored higher/lower?",
  render: (container, rawData) => {},
  explanation: ``,
},{
  question: "3. Did standing have any affect on the score? Did sophomores or juniors do better?",
  render: (container, rawData) => {},
  explanation: ``,
},{
  question: "4. Did having or lacking the prerequisite have an affect on the score?",
  render: (container, rawData) => {},
  explanation: ``,
}]

// Wait for document to load
$(() => {
  // Load the CSV data
  d3.csv('data.csv', function(err, data) {
    if (err) throw err;
    // Render everything!
    questions.forEach(function(q) {
      let container = $('<div>').css({
        'font-family': 'helvetica',
        'margin': '20px',
      }).append($('<h2>').text(q.question))
      let chart = $('<div>')
      container.append(chart)
      q.render(chart.get(0), data)
      chart.after($('<p>').text(q.explanation).css({
        'font-size': '1.2em'
      }))
      $('body').append(container);
    })
  });
})
