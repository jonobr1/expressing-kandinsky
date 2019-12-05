var TWO_PI = Math.PI * 2;
var vector = new Two.Vector();
var mouse = new Two.Vector();
var radius = Math.min(two.width, two.height) / 4;
var sides = [3, 4, 8, 64];
var side = 4;
var sid = 1;
var vertices = Two.Utils.map(Two.Utils.range(sides[sides.length - 1]), getAnchor);
var plane = two.makePath(vertices.slice(0, side));
var square = two.makePath([
  new Two.Anchor(- radius, - radius),
  new Two.Anchor(  radius, - radius),
  new Two.Anchor(  radius,   radius),
  new Two.Anchor(- radius,   radius)
]);
var selection = two.makeCircle(0, 0, 50);
var text = two.makeText('Sides: ' + side, 0, two.height / 2 - 50, {
  size: 25,
  family: 'futura-pt, Arial, sans-serif'
});

plane.closed = true;
square.closed = true;
square.dashes = [10, 4];

selection.noFill().stroke = 'orange';
selection.linewidth = 3;
selection.visible = false;

plane.noFill().stroke = '#333';
square.noFill().stroke = '#333';

two.scene.position.set(two.width / 2, two.height / 2);
update();

two.renderer.domElement.addEventListener('mousedown', mousedown, false);
two.bind('update', function() {
  if (selection.visible) {
    selection.scale += (1 - selection.scale) * 0.125;
    if (selection.scale >= 0.999) {
      selection.scale = 0;
    }
  }
});

function mousedown(e) {
  var rect = two.renderer.domElement.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
  var checkedSides = recalculate(true);
  if (!checkedSides) {
    window.addEventListener('mousemove', mousemove, false);
    window.addEventListener('mouseup', mouseup, false);
  }
  update();
}

function mousemove(e) {
  var rect = two.renderer.domElement.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
  recalculate();
  update();
}

function mouseup(e) {
  selection.visible = false;
  window.removeEventListener('mousemove', mousemove, false);
  window.removeEventListener('mouseup', mouseup, false);
}

function recalculate(checkSides) {

  var d;
  var current = null;
  var minDistance = Infinity;

  for (var i = 0; i < square.vertices.length; i++) {
    var v = square.vertices[i];
    vector.copy(v).add(two.scene.position);
    d = vector.distanceToSquared(mouse);
    if (minDistance > d) {
      minDistance = d;
      current = v;
    }
  }

  if (checkSides) {
    vector.copy(text.position).add(two.scene.position);
    d = vector.distanceToSquared(mouse);
    if (minDistance > d) {
      minDistance = d;
      sid = (sid + 1) % sides.length;
      side = sides[sid];
      text.value = 'Sides: ' + side;
      return true;
    }
  }

  current.x = mouse.x - two.scene.position.x;
  current.y = mouse.y - two.scene.position.y;

  selection.visible = true;
  selection.position.copy(current);

}

function update() {

  var rect = square.getBoundingClientRect(true);

  if (side !== plane.vertices.length) {
    plane.vertices = vertices.slice(0, side);
  }

  for (var i = 0; i < plane.vertices.length; i++) {

    var pct = i / plane.vertices.length;
    var theta = (TWO_PI * pct + Math.PI * 0.5) % (TWO_PI);
    var x, y, r = 0;

    if (theta < 0.25 * TWO_PI || theta > 0.75 * TWO_PI) {
      // Right
      r = Math.max(r, Math.abs(rect.right));
    } else {
      // Left
      r = Math.max(r, Math.abs(rect.left));
    }

    if (theta > 0.5 * TWO_PI) {
      // Top
      r = Math.max(r, Math.abs(rect.top));
    } else {
      // Bottom
      r = Math.max(r, Math.abs(rect.bottom));
    }

    var x = r * Math.cos(theta);
    var y = r * Math.sin(theta);
    plane.vertices[i].set(x, y);

  }

}

function getAnchor(i) {
  return new Two.Anchor();
}
