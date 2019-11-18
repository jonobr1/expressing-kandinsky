(function(root) {

  var _ = Two.Utils;

  var Shapes = root.Shapes = function(callback) {

    Shapes.Instances.push(this);

    if (_.isFunction(callback)) {
      this.bind('ready', callback);
    }

    if (Shapes.loaded) {
      this.trigger('ready');
    }

  };

  _.extend(Shapes, {

    Textures: [],

    Instances: [],

    loaded: false,

    Types: ['points', 'lines', 'planes']

  });

  _.extend(Shapes.prototype, Two.Utils.Events, {

    index: 0,

    constructor: Shapes,

    get: function() {
      var index = this.index;
      this.index = (this.index + 1) % Shapes.Textures.length;
      return Shapes.Textures[index];
    }

  });

  var amount = 62;
  var ready = _.after(amount, _.once(loaded));
  var sizes = [32, 64, 128, 512, 1024, 2048, 4096];

  Shapes.Types.indices = [6, 36, 62];
  Shapes.Types.map = {
    points: 0, lines: 1, planes: 2
  };
  Shapes.Types.lengths = [4, 12, 20];

  _.map(_.range(0, amount), function(i) {

    var index = i + 1;
    var path = 'Asset ' + index + '.png';
    var uri = './assets/images/shapes/2x/' + path;

    var image = document.createElement('img');
    image.onload = generate;
    image.src = uri;

    var two = new Two({ type: Two.Types.canvas });
    var canvas = two.renderer.domElement;
    var texture = new THREE.Texture(canvas);

    texture.userData = {};

    for (var j = 0; j < Shapes.Types.length; j++) {

      var type = Shapes.Types[j];
      var count = Shapes.Types.indices[j];

      if (count >= index) {
        texture.userData.type = type;
        texture.userData.offset = i - (Shapes.Types.indices[j - 1] || 0);
        break;
      }

    }

    Shapes.Textures.push(texture);

    function generate() {

      var index = 0;
      var side = Math.max(image.width, image.height);

      while (side > sizes[index]) {
        index++;
      }

      var size = sizes[index];

      two.width = size;
      two.height = size;
      two.renderer.setSize(size, size, 1);

      two.scene.position.set(two.width / 2, two.height / 2);
      var sprite = two.makeSprite(new Two.Texture(image), 0, 0);

      two.update();
      texture.needsUpdate = true;
      ready();

    }

  });

  function loaded() {

    for (var i = 0; i < Shapes.Instances.length; i++) {
      Shapes.Instances[i].trigger('ready');
    }

    Shapes.loaded = true;

  }

})(window);
