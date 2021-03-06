(function(root) {

  var _ = Two.Utils;

  var HALF_PI = Math.PI / 2;
  var TWO_PI = Math.PI * 2;
  var mouse = new THREE.Vector2();
  var raycaster = new THREE.Raycaster();
  var PlaneGeometry = new THREE.PlaneBufferGeometry(0.1, 0.1, 10, 10);

  var Composition = root.Composition = function(camera) {

    THREE.Group.call(this);

    this.mode = Composition.Modes.Outlines;
    this.currentTime = 0;
    delete this.type;

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
    this.schedule = [];
    this.schedule.points = [];
    this.schedule.lines = [];
    this.schedule.planes = [];

    this.schedule.points.index = 0;
    this.schedule.lines.index = 0;
    this.schedule.planes.index = 0;

    this.hitbox.visible = false;
    this.hitbox.renderOrder = 500;
    this.hitbox.userData.isHitbox = true;
    this.add(this.hitbox);

  };

  _.extend(Composition, {

    Limit: 50,

    Modes: {
      color: 'color',
      outline: 'outline'
    },

    Types: {
      points: 'points',
      lines: 'lines',
      planes: 'planes'
    }

  });

  _.extend(Composition.prototype, THREE.Group.prototype, {

    index: 0,

    bpm: 124,

    constructor: Composition,

    reserve: function(note) {

      var list = this.schedule[note.type.name];

      if (!list) {
        return this;
      }

      var mesh = list[list.index];
      if (!mesh) {
        return this;
      }
      mesh.userData.startTime = this.currentTime;
      mesh.userData.duration = note.duration;

      if (this.schedule.indexOf(mesh) < 0) {
        this.schedule.push(mesh);
      }

      list.index = (list.index + 1) % list.length;

      return this;

    },

    update: function(time) {

      this.currentTime = time || Date.now();

      if (this.type) {
        this.enforceSchedule(time);
      } else {
        this.animateShapesBasedOnTime(time);
      }

      return this;

    },

    enforceSchedule: function(time) {

      for (var i = 0; i < this.schedule.length; i++) {

        var mesh = this.schedule[i];
        var data = mesh.userData;
        var type = mesh.userData.type;
        var startTime = mesh.userData.startTime;
        var duration = mesh.userData.duration * 1000;
        var elapsed = time - startTime;
        var pct = elapsed / duration;

        if (/(points|planes)/i.test(type)) {
          mesh.scale.x = data.scale
            + data.direction * Math.pow(Math.sin(pct * Math.PI), 4)
            * data.magnitude;
          mesh.scale.y = mesh.scale.x;
          mesh.scale.z = mesh.scale.z;
        }

        if (/(lines|planes)/i.test(type)) {
          mesh.rotation.z = data.rotation
            + data.direction * Math.pow(Math.sin(data.phi * pct * TWO_PI), 2)
            * data.magnitude;
        }

        if (pct >= 1) {
          this.schedule.splice(i, 1);
        }

      }

      return this;

    },

    animateShapesBasedOnTime: function(time) {

      var start = this.index;
      var end = Math.min(this.index + Composition.Limit, this.children.length);

      var bps = this.bpm / 60;
      var spb = 1 / bps;

      for (var i = start; i < end; i++) {

        var child = this.children[i];

        if (child.userData.isHitbox
          || (this.current && this.current.id === child.id)) {
          continue;
        }

        var type = child.material.map.userData.type;

        var bar, beat, pct, mupb, offset;

        switch (type) {
          case 'points':
            mupb = spb * 500;
            bar = mupb * Shapes.Types.lengths[Shapes.Types.map.points];
            break;
          case 'lines':
            mupb = spb * 1000;
            bar = mupb * Shapes.Types.lengths[Shapes.Types.map.lines];
            break;
          case 'planes':
            mupb = spb * 2000;
            bar = mupb * Shapes.Types.lengths[Shapes.Types.map.planes];
            break;
        }

        offset = child.material.map.userData.offset * mupb;
        beat = (time + offset) % bar;
        pct = Math.min(beat / mupb, 1);

        var data = child.userData;

        if (/(points|planes)/i.test(type)) {
          child.scale.x = data.scale
            + data.direction * Math.pow(Math.sin(pct * Math.PI), 4)
            * data.magnitude;
          child.scale.y = child.scale.x;
          child.scale.z = child.scale.x;
        }

        if (/(lines|planes)/i.test(type)) {
          child.rotation.z = data.rotation
            + data.direction * Math.pow(Math.sin(data.phi * pct * TWO_PI), 2)
            * data.magnitude;
        }

      }

      this.index = end;

      if (this.index >= this.children.length) {
        this.index = 0;
      }

      return this;

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

        this.current.userData.phi = Math.random() * 4 + 1;
        this.current.userData.phi = Math.floor(this.current.userData.phi);
        this.current.userData.magnitude = Math.random() * 0.4 + 0.1;
        this.current.userData.magnitude /= this.current.scale.x;
        this.current.userData.direction = Math.random() > 0.5 ? 1 : - 1;
        this.current.userData.rotation = this.current.rotation.z;
        this.current.userData.scale = this.current.scale.x;

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
        material.map = this.shapes.get(this.type);
      }

      var mesh = new THREE.Mesh(geometry, material);

      mesh.userData.scale = scale;
      mesh.position.copy(position);

      this.add(mesh);

      if (this.type in this.schedule) {
        mesh.userData.type = this.type;
        this.schedule[this.type].push(mesh);
      }

      return mesh;

    },

    set: function(shapes) {

      this.shapes = shapes;
      return this;

    }

  });

})(window);
