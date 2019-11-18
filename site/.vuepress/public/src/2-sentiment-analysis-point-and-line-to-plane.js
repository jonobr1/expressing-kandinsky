var sentences, index = 0;
var rows, cols;
var circle = new Two.Circle(- 50, - 50, 10);
var line = new Two.Line();

line.stroke = '#333';
line.opacity = 0.2;

circle.noStroke();
circle.fill = new Two.RadialGradient(0, 0, 10, [
  new Two.Stop(1),
  new Two.Stop(0)
]);

two.add(line, circle);

var xhr = new XMLHttpRequest();
xhr.open('GET', '/data/point-and-line-to-plane.sentiments.json');

xhr.onload = function() {
  setup(xhr.responseText);
};

xhr.send();

function setup(resp) {

  var json = JSON.parse(resp);
  sentences = json.sentences;

  cols = Math.floor(Math.sqrt(sentences.length));
  rows = Math.ceil(sentences.length / cols);

  two.bind('update', draw);
  two.play();

}

function draw() {

  if (index >= sentences.length) {
    circle.visible = false;
    line.visible = false;
    return;
  }

  var sentence = sentences[index];
  var sentiment = sentence.sentiment;

  var width = two.width * 0.9;
  var height = two.height * 0.9;
  var margin = (two.width - width) / 2;

  var col = index % cols;
  var row = Math.floor(index / cols);

  var x = width * col / cols + margin;
  var y = height * row / rows + margin;

  line.vertices[0].set(x, y);
  line.vertices[1].copy(circle.position);

  if (index <= 0) {
    line.vertices[1].set(x, y);
  }

  var size = Math.pow(sentence.text.content.length, 0.33);

  circle.position.set(x, y);
  circle.radius = Math.pow(sentiment.magnitude * size, 2);
  circle.fill.radius = circle.radius;

  var t = Math.floor(255 * sentiment.score);
  var color = 'rgba(' + Math.max(- t, 0) + ', 100, ' + Math.max(t, 0) + ', ';

  for (var i = 0; i < circle.fill.stops.length; i++) {
    var stop = circle.fill.stops[i];
    stop.color = color + i + ')';
  }

  index++;

}
