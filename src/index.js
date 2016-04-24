var $ = require('jquery');
var d3 = require('d3');
var barchart = require('./barchart');
  
d3.csv('data.csv', function(err, data) {
  if (err) throw err;

  var majors = {}
  data.forEach(function(d) {
    if (majors[d.Major]) {
      majors[d.Major] ++;
    } else {
      majors[d.Major] = 1;
    }
  })

  var majorNames = Object.keys(majors);
  var majorData = [];

  majorNames.forEach(function(name) {
    majorData.push({ value: majors[name], name: name })
  })

  var alphaSortedMajors = majorData.sort((a, b) => a.name.localeCompare(b.name))

  var questions = [{
    question: "1. Frequency/counting: How many students are in each major (in this class)?",
    render: (container) => barchart.render(container, { data: alphaSortedMajors })
  },{
    question: "2. Did major have any affect on the score? Which majors scored higher/lower?",
    render: function() {
      
    }
  },{
    question: "3. Did standing have any affect on the score? Did sophomores or juniors do better?",
    render: function() {
      
    }
  },{
    question: "4. Did having or lacking the prerequisite have an affect on the score?",
    render: function() {
      
    }
  }]

  questions.forEach(function(q) {
    var container = $('<div>').css({
      'font-family': 'helvetica',
      'margin': '20px',
    }).text(q.question)
    var chart = $('<div>')
    container.append(chart)
    if (q.render) q.render(chart.get(0))
    $('body').append(container);
  })
});
