(function(root) {

  var _ = Two.Utils;

  var HALF_PI = Math.PI / 2;
  var mouse = new THREE.Vector2();
  var raycaster = new THREE.Raycaster();
  var PlaneGeometry = new THREE.PlaneBufferGeometry(0.1, 0.1, 10, 10);

  var Composition = root.Composition = function(camera) {

    THREE.Group.call(this);

    this.camera = camera;
    this.hitbox = new THREE.Mesh(
      PlaneGeometry.clone().scale(100, 100, 100),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        wireframe: true,
        depthTest: false,
        depthWrite: false,
        opacity: 0
      })
    );

    this.current = null;

    this.hitbox.visible = false;
    this.hitbox.renderOrder = 500;
    this.add(this.hitbox);

  };

  _.extend(Composition.prototype, THREE.Group.prototype, {

    constructor: Composition,

    update: function() {

    },

    //

    start: function(x, y) {

      var camera = this.camera;

      this.hitbox.visible = true;
      this.setRandomDistance();
      mouse.set(x, y);

      raycaster.setFromCamera(mouse, camera);
      var intersections = raycaster.intersectObject(this.hitbox);

      if (intersections.length > 0) {

        var intersection = intersections[0];
        var point = intersection.point;

        this.current = this.create(point, camera.position.z - point.z);

      }

      return this;

    },

    drag: function(x, y) {

      if (this.current) {

        var camera = this.camera;

        mouse.set(x, y);
        raycaster.setFromCamera(mouse, camera);

        var intersections = raycaster.intersectObject(this.hitbox);

        if (intersections.length > 0) {

          var intersection = intersections[0];
          var point = intersection.point;

          var dist = this.current.position.distanceTo(point);
          var rotation = Two.Vector.angleBetween(
            this.current.position.x, this.current.position.y,
            point.x, point.y
          );

          var normal = dist / (this.current.userData.scale * 0.33);
          var scale = normal + 1;
          this.current.scale.set(scale, scale, scale);
          this.current.rotation.z = rotation + HALF_PI;

        }

      }

      return this;

    },

    end: function(x, y) {

      if (this.current) {
        this.current = null;
      }

      this.hitbox.visible = false;

      return this;

    },

    setRandomDistance: function() {

      var dist = 100 * (Math.random() * 0.9 + 0.1);
      this.hitbox.position.copy(this.camera.position);
      this.hitbox.position.z -= dist;
      this.hitbox.scale.set(2 * dist, 2 * dist, 1);
      this.hitbox.updateWorldMatrix();

      return this;

    },

    create: function(position, distanceFromCamera) {

      var geometry = PlaneGeometry.clone();
      var scale = Math.abs(distanceFromCamera);

      geometry.scale(scale, scale, scale);

      var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true
      });

      if (this.shapes) {
        material.map = this.shapes.get();
      }

      var mesh = new THREE.Mesh(geometry, material);

      mesh.userData.scale = scale;
      mesh.position.copy(position);
      this.add(mesh);

      return mesh;

    },

    set: function(shapes) {

      this.shapes = shapes;
      return this;

    }

  });

})(window);
