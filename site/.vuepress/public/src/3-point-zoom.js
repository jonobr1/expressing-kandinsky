var _ = Two.Utils;
var amount = 128;
var circles = [];

two.scene.position.set(two.width / 2, two.height / 2);

for (var i = 0; i < amount; i++) {
  var theta = Math.random() * Math.PI * 2;
  var radius = Math.random() * (5 - 2) + 1;
  var x = radius * Math.cos(theta);
  var y = radius * Math.sin(theta);
  if (i === 0) {
    x = 0;
    y = 0;
  }
  var elem = two.makeCircle(x, y, 2);
  elem.noStroke();
  elem.fill = '#333';
  circles.push(elem);
}

var circle = two.makeCircle(0, 0, 5);
circle.noStroke();
circle.fill = '#333';

var total = 300;

two.bind('update', function(frameCount, timeDelta) {

  var frame = frameCount % total;
  var t = frame / total;

  two.scene.scale = 10 + (t * 500);
  circle.opacity = Math.max(1 - Math.pow(t, 0.025), 0);

  var radius = 0.9 * (1 - Math.pow(t, 0.125)) + 0.1;

  for (var i = 0; i < circles.length; i++) {
    var elem = circles[i];
    elem.radius = radius;
  }

});
