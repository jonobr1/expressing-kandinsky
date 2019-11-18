(function(root) {

  var _ = Two.Utils;
  var TWO_PI = Math.PI * 2;
  var HALF_PI = Math.PI * 0.5;
  var vector = new Two.Vector();

  var Paint = root.Paint = function(callback) {

    var scope = this;

    var two = this.two = new Two({
      type: Two.Types.canvas,
      overdraw: true,
      ratio: 1
    });

    this.ready = false;
    this.working = false;
    this.index = - 1;
    this.sprite = null;
    this.background = new Two.Texture('./assets/images/oil-canvas.jpg', setup);
    this.texture = new THREE.Texture(two.renderer.domElement);

    this.texture.minFilter = this.texture.magFilter = THREE.LinearFilter;
    this.texture.generateMipmaps = false;
    this.texture.format = THREE.RGBFormat;

    this.drop = Paint.CreateDrop(256);
    this.origin = new Two.Vector();
    this.destination = new Two.Vector();

    function setup() {

      var sprite = scope.sprite = new Two.Sprite(scope.background, 0, 0);
      sprite.scale = 0.5;
      sprite.position.set(two.width / 2, two.height / 2);

      two.add(sprite);
      two.update();
      two.remove(sprite);

      scope.texture.needsUpdate = true;

      scope.ready = true;
      scope.trigger(Two.Events.load);

    }

  };

  _.extend(Paint, {

    Resolution: 20,

    Colors: [
      { red: 250, green: 220, blue: 25 },
      { red: 90, green: 85, blue: 120 },
      { red: 225, green: 50, blue: 0 },
      { red: 225, green: 115, blue: 25 },
      { red: 230, green: 150, blue: 75 },
      { red: 150, green: 100, blue: 160 },
      { red: 160, green: 195, blue: 150 },
      { red: 180, green: 30, blue: 15 },
      { red: 120, green: 110, blue: 180 },
      { red: 120, green: 90, blue: 100 },
      { red: 100, green: 125, blue: 75 },
      { red: 240, green: 225, blue: 150 },
      { red: 200, green: 175, blue: 160 }
    ],

    CreateDrop: function(resolution) {

      var vertices = [];
      for (var i = 0; i < resolution; i++) {

        var pct = i / resolution;
        var angle = TWO_PI * pct;

        var x = Math.cos(angle);
        var y = Math.sin(angle);

        var anchor = new Two.Anchor(x, y);
        anchor.angle = angle;

        vertices.push(anchor);

      }

      return new Two.Path(vertices, true);

    }

  });

  _.extend(Paint.prototype, Two.Utils.Events, {

    size: 100,
    times: 30,

    constructor: Paint,

    setSize: function(width, height) {

      var two = this.two;
      two.renderer.setSize(width, height);

      return this;

    },

    paint: function(x1, y1, x2, y2) {

      var two = this.two;
      var ctx = two.renderer.ctx;
      var drop = this.drop;
      var sprite = this.sprite;

      this.index = (this.index + 1) % Paint.Colors.length;
      this.frame = 0;
      this.working = true;
      this.origin.set(x1, y1);
      this.destination.set(x2, y2);

      two.remove(drop);

      ctx.globalCompositeOperation = 'source-over';

      sprite.opacity = 0.05;
      two.add(sprite);
      two.update();
      two.remove(sprite);

      this.texture.needsUpdate = true;

      ctx.globalCompositeOperation = 'soft-light';

      two.add(drop);

      return this;

    },

    update: function() {

      if (!this.ready || !this.working || this.frame >= this.times) {
        this.working = false;
        return this;
      }

      var two = this.two;
      var colors = Paint.Colors;
      var index = this.index;
      var frame = this.frame;
      var times = this.times;
      var size = this.size;
      var drop = this.drop;

      var pct = frame / times;
      var feather = Math.sin(Math.PI * pct);

      vector.copy(this.origin)
        .lerp(this.destination, pct);

      for (var i = 0; i < Paint.Resolution; i++) {

        var theta = Math.random() * TWO_PI;
        var amp = Math.random() * size * feather;
        var x = vector.x + amp * Math.cos(theta);
        var y = vector.y + amp * Math.sin(theta);

        drop.position.set(x, y);
        drop.radius = Math.pow(Math.random(), 7) * size * (feather + 0.1);
        drop.stroke = 'rgba(0, 0, 0, 1)';
        drop.linewidth = Math.random();
        drop.fill = this.getColorVariant(index);
        drop.opacity = Math.random() * feather / 2;

        for (var j = 0; j < drop.vertices.length; j++) {

          var v = drop.vertices[j];
          var angle = Math.atan2(- v.y, - v.x);
          var radius = (0.25 * Math.random()) * drop.radius
            + drop.radius * 0.25;

          v.x = radius * Math.cos(angle);
          v.y = radius * Math.sin(angle);

        }

        two.update();

      }

      this.texture.needsUpdate = true;
      this.frame++;

      return this;

    },

    getColorVariant: function(index, amount) {

      var base = Paint.Colors[index];
      var amt = amount || (Math.random() * 10 - 5);

      return 'rgb('
        + Math.floor(Math.min(Math.max(base.red + amt, 0), 255)) + ','
        + Math.floor(Math.min(Math.max(base.green + amt, 0), 255)) + ', '
        + Math.floor(Math.min(Math.max(base.blue + amt, 0), 255)) + ')';

    }

  });

})(window);
