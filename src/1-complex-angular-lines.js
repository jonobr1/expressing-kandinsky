var HALF_PI = Math.PI / 2;
var mouse = new Two.Vector();
var touch;
var line = new Two.Line();
var waves = new Two.Group();

two.add(line, waves);

two.renderer.domElement.addEventListener('mousedown', mousedown, false);
two.renderer.domElement.addEventListener('touchstart', touchstart, false);
two.renderer.domElement.addEventListener('touchmove', touchmove, false);
two.renderer.domElement.addEventListener('touchend', touchend, false);
two.renderer.domElement.addEventListener('touchcancel', touchend, false);

two.bind('update', function() {

  for (var i = 0; i < waves.children.length; i++) {

    var child = waves.children[i];
    var needsUpdate = false;

    if (child.t <= 0.999) {
      child.t += (1 - child.t) * 0.125;
      needsUpdate = true;
    } else if (child.t !== 1) {
      child.t = 1;
      needsUpdate = true;
    }

    if (needsUpdate) {
      for (var j = 0; j < child.vertices.length; j++) {
        var v = child.vertices[j];
        v.copy(v.origin).lerp(v.destination, child.t);
      }
    }

  }

});

function mousedown(e) {

  var rect = two.renderer.domElement.getBoundingClientRect();
  var x = document.body.scrollLeft + e.clientX;
  var y = document.body.scrollTop + e.clientY;

  mouse.set(x - rect.left, y - rect.top);

  line.vertices[0].copy(mouse);
  line.vertices[1].copy(mouse);
  line.visible = true;

  window.addEventListener('mousemove', mousemove, false);
  window.addEventListener('mouseup', mouseup, false);

}

function mousemove(e) {

  var rect = two.renderer.domElement.getBoundingClientRect();
  var x = document.body.scrollLeft + e.clientX;
  var y = document.body.scrollTop + e.clientY;

  mouse.set(x - rect.left, y - rect.top);
  line.vertices[1].copy(mouse);

}

function mouseup(e) {

  var rect = two.renderer.domElement.getBoundingClientRect();
  var x = document.body.scrollLeft + e.clientX;
  var y = document.body.scrollTop + e.clientY;

  mouse.set(x - rect.left, y - rect.top);
  line.visible = false;
  add(line.vertices[0], line.vertices[1]);

  window.removeEventListener('mousemove', mousemove, false);
  window.removeEventListener('mouseup', mouseup, false);

}

function touchstart(e) {
  e.preventDefault();
  touch = e.touches[0];
  mousedown(touch);
}

function touchmove(e) {
  e.preventDefault();
  touch = e.touches[0];
  mousemove(touch);
}

function touchend(e) {
  e.preventDefault();
  mouseup(e.touches[0] || touch);
}

function add(a, b) {

  var amount = Math.floor(Math.random() * 12) + 2;
  var vertices = [];
  var angle = Math.atan2(b.y - a.y, b.x - a.x);
  var dist = Two.Vector.distanceBetween(a, b);

  for (var i = 0; i < amount; i++) {

    var pct = i / (amount - 1);
    var point = new Two.Anchor().copy(a).lerp(b, pct);
    point.origin = new Two.Vector().copy(point);

    var theta = (i % 2) ? angle + HALF_PI : angle - HALF_PI;
    var amp = Math.random() * dist / amount;

    var dx = amp * Math.cos(theta);
    var dy = amp * Math.sin(theta);

    point.destination = new Two.Vector().copy(point);

    if (amount > 2) {
      point.destination.x += dx;
      point.destination.y += dy;
    }

    vertices.push(point);

  }

  var path = new Two.Path(vertices, false, vertices.length > 7);
  path.noFill();
  path.t = 0;

  waves.add(path);

  return path;

}
