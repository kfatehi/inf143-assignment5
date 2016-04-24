const $ = require('jquery');
const d3 = require('d3');

// Wait for document to load
$(() => {
  // Fetch the data
  d3.text("data.csv", function(csv) {
    // Render the data table
    var rows = d3.csv.parseRows(csv);
    d3.select("body").append("table")
    .selectAll("tr").data(rows).enter().append("tr")
    .selectAll("td").data(d=>d).enter().append("td").text(d=>d)

    // Render the questions, charts, and explanations
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

    // Render the source code
    let src = ['index.html', 'style.css', 'src/index.js']
    src.forEach((path) => {
      d3.text(path, function(code) {
        let container = $('<div>').append($('<h3>').text(path))
        container.append($('<pre>').text(code))
        $('body').append(container)
      })
    })
  });
})

// Define a reusable, generic barchart
let barchart = (container, data) => {
  let max = d3.max(data, d=>d.value)

  let width = 420;
  let barHeight = 20;
  let x = d3.scale.linear().range([0, width]).domain([0, max])
  let fill = d3.scale.linear().domain([0, max]).range(['#FF393E', '#74FF63'])

  let chart = d3.select(container)
  .attr('width', width)
  .attr("height", barHeight * data.length);

  let bar = chart.selectAll("g").data(data)
  .enter().append("g")
  .attr("transform", (d, i) => `translate(0,${ i * barHeight })`);

  bar.append("rect")
  .attr('fill', d => fill(d.value))
  .attr('width', d => x(d.value))
  .attr('height', barHeight - 1);

  bar.append('text')
  .attr('x', d => x(d.value) - 3)
  .attr('y', barHeight / 2)
  .attr('dy', '.35em')
  .text(d => `${d.name} (${d.value})`)
  
}
  
let questions = [{
  question: "1. Frequency/counting: How many students are in each major (in this class)?",
  render: (container, rawData) => {
    let majors = {}
    let tempData = [];
    rawData.forEach(d => majors[d.Major] ?  majors[d.Major] ++ : majors[d.Major] = 1)
    Object.keys(majors).forEach(name => tempData.push({ value: majors[name], name: name }))
    let data = tempData.sort((a, b) => a.name.localeCompare(b.name))
    barchart(container, data)
  },
  explanation: `
  This graphic allows the user to determine how many students are in each major.
  It does this by clearly labelling the number of students and the major within each bar.
  By using color and bar size it allows the viewer to determine, at a glance, which majors are more
  or less popular. By sorting in alphabetical order, the viewer can quickly scan to the major of interest.
  `,
},{
  question: "2. Did major have any affect on the score? Which majors scored higher/lower?",
  render: (container, rawData) => {
    let majors = {}
    rawData.forEach(d => {
      let grade = parseInt(d.Grade)
      majors[d.Major] ? majors[d.Major] += grade : majors[d.Major] = grade
    })
    let tempData = [];
    Object.keys(majors).forEach(name => tempData.push({ value: majors[name], name: name }))
    let data = tempData.sort((a, b) => a.name.localeCompare(b.name))
    barchart(container, data)
  },
  explanation: `
  It is difficult to answer if major had an affect on score, however we can plot the data we have.
  In this case, we can see that the Computer Science students had the highest scores while the
  Medieval History, Gender Studies, and Art students had the lowest scores.
  Color, bar size, and alphabetical ordering are used in order to improve seek time.
  `,
},{
  question: "3. Did standing have any affect on the score? Did sophomores or juniors do better?",
  render: (container, rawData) => {
    let standings = {}
    rawData.forEach(d => {
      let grade = parseInt(d.Grade)
      standings[d.Standing] ? standings[d.Standing] += grade : standings[d.Standing] = grade
    })
    let tempData = [];
    Object.keys(standings).forEach(name => tempData.push({ value: standings[name], name: name }))
    let data = tempData.sort((a, b) => a.name.localeCompare(b.name))
    barchart(container, data);
  },
  explanation: `
  The graphic uses the students' standing as a dimension with respect to the students' scores.
  It allows the viewer to see which majors had the best scores. It does this using the bar size
  as well as color. Sophomores, having the lowest combined score, has a small, red bar while the
  top performing standings (Junior, Senior) have a large, green bar.
  `,
},{
  question: "4. Did having or lacking the prerequisite have an affect on the score?",
  render: (container, rawData) => {
    let req = { "Prepared": 0, "Unprepared": 0 }
    rawData.forEach(d => {
      let grade = parseInt(d.Grade)
      let hadReq = d['Prerequisites?'] === "Y" ? true : false;
      hadReq ? req["Prepared"] += grade : req["Unprepared"] += grade
    })
    let tempData = [];
    Object.keys(req).forEach(name => tempData.push({ value: req[name], name: name }))
    let data = tempData.sort((a, b) => a.name.localeCompare(b.name))
    barchart(container, data);
  },
  explanation: `
  This graphic answers whether or not the prerequisite had a significant effect on students' grades.
  The two bars have the same color and size indicating that there was not really a difference in the
  students' grades based on having taken the prerequisite.
  `,
}]
