(function(root) {

  var _ = Two.Utils;

  var Sequencer = root.Sequencer = function(uri) {

    var scope = this;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', uri);
    xhr.onload = setup;

    var two = this.two = new Two();
    this.staff = two.makeGroup();

    this.startTime = 0;
    this.time = 0;
    this.index = 0;
    this.duration = 0;

    this.midi = { min: Infinity, max: - Infinity };
    this.tracks = two.makeGroup();
    this.cursor = two.makeLine(0, 0, 0, 0);
    this.margin = {
      top: 25,
      left: 25,
      right: 25,
      bottom: 25
    };

    this.cursor.stroke = '#999';

    xhr.send();

    function setup() {

      scope.data = JSON.parse(xhr.responseText);
      var notes = scope.data.tracks[0].notes;

      var midi = scope.midi;

      for (var i = 0; i < notes.length; i++) {

        var tid = Math.floor(Math.random() * Sequencer.Types.length);
        var type = Sequencer.Types[tid];
        var note = notes[i];
        var duration = note.duration;
        var startTime = note.time;
        var value = note.midi;

        note.endTime = startTime + duration;
        note.type = type;
        midi.min = Math.min(midi.min, value);
        midi.max = Math.max(midi.max, value);
        scope.duration = Math.max(scope.duration, note.endTime);

        var path = new Two.Line(0, 0, 0, 0);
        path.linewidth = 4;
        path.cap = 'round';
        path.join = 'round';
        path.userData = note;
        path.stroke = type.color;
        path.opacity = 0.66;
        scope.tracks.add(path);

      }

      scope.setSize(two.width, two.height);

    }

  };

  _.extend(Sequencer, {

    Types: [
      {
        name: 'points',
        color: '#AE00FF',
        partOfSpeech: 'preposition'
      },
      {
        name: 'lines',
        color: '#FF5555',
        partOfSpeech: 'verb'
      },
      {
        name: 'planes',
        color: 'orange',
        partOfSpeech: 'noun'
      },
      {
        name: 'color',
        color: '#39b54a',
        partOfSpeech: 'adjective'
      }
    ],

  });

  _.extend(Sequencer.prototype, Two.Utils.Events, {

    loop: true,

    constructor: Sequencer,

    appendTo: function(elem) {
      this.two.appendTo(elem);
      return this;
    },

    play: function() {

      this.playing = true;
      this.startTime = Date.now();
      if (this.time === 0) {
        this.time = this.startTime;
      }
      return this;

    },

    pause: function() {

      this.playing = false;
      return this;

    },

    stop: function() {

      this.pause();
      this.startTime = 0;
      this.time = this.startTime;
      this.index = 0;
      return this;

    },

    setSize: function(width, height) {

      this.two.width = width;
      this.two.height = height;
      this.two.renderer.setSize(width, height);

      this.cursor.vertices[0].set(0, 0);
      this.cursor.vertices[1].set(0, height);

      for (var i = 0; i < this.tracks.children.length; i++) {

        var child = this.tracks.children[i];
        var note = child.userData;

        var x1 = this.timeToColumn(note.time);
        var y = this.midiToRow(note.midi);
        var x2 = this.timeToColumn(note.endTime);
        var width = x2 - x1;
        var x = x1 + width / 2;

        child.vertices[0].set(- width / 2, 0);
        child.vertices[1].set(width / 2, 0);
        child.position.set(x, y);

      }

      return this;

    },

    timeToColumn: function(v) {
      var width = this.two.width
        - (this.margin.left + this.margin.right);
      return width * v / this.duration + this.margin.left;
    },

    midiToRow: function(v) {
      var height = this.two.height
        - (this.margin.top + this.margin.bottom);
      return height * (v - this.midi.min)
        / (this.midi.max - this.midi.min) + this.margin.top;
    },

    update: function() {

      if (this.playing) {

        this.time = Date.now();

        var elapsed = (this.time - this.startTime) / 1000;

        for (var i = this.index; i < this.tracks.children.length; i++) {

          var child = this.tracks.children[i];
          var note = child.userData;

          if (note.time < elapsed && note.endTime > elapsed) {
            child.opacity = 0.95;
            child.scale = 1.25;
            if (!note.playing) {
              note.playing = true;
              this.trigger('note', note);
            }
          } else {
            child.opacity = 0.66;
            child.scale = 1;
            note.playing = false;
          }

          if (note.time > elapsed) {
            break;
          }

        }

        this.cursor.position.x = this.timeToColumn(elapsed);

        if (this.loop && elapsed >= this.duration) {
          this.startTime = this.time;
          this.index = 0;
        }

      }

      this.two.update();

      return this;

    }

  });

})(window);
