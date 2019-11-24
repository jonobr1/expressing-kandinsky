(function(root) {

  var _ = Two.Utils;
  var black = {
    r: 0, g: 0, b: 0
  };
  var colors = window.colors = {};
  var color = new THREE.Color();

  var Editor = root.Editor = function(uri) {

    var scope = this;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', uri);
    xhr.onload = setup;

    this.domElement = document.createElement('div');
    this.domElement.classList.add('editor');

    this.schedule = [];
    this.schedule.preposition = [];
    this.schedule.noun = [];
    this.schedule.verb = [];
    this.schedule.adjective = [];

    this.schedule.index = 0;
    this.schedule.preposition.index = 0;
    this.schedule.noun.index = 0;
    this.schedule.verb.index = 0;
    this.schedule.adjective.index = 0;

    xhr.send();

    function setup() {

      scope.data = JSON.parse(xhr.responseText);

      var tokens = scope.data.tokens;

      for (var i = 0; i < tokens.length; i++) {

        var token = tokens[i];
        var elem = document.createElement('span');
        var type = Editor.Tags[token.partOfSpeech.tag];

        elem.type = type;
        elem.classList.add(type);
        elem.textContent = token.text.content;

        if (type in scope.schedule) {
          scope.schedule[type].push(elem);
        }

        scope.domElement.appendChild(elem);

      }

    }

  };

  _.extend(Editor, {

    Tags: {
      ADP: 'preposition',
      ADJ: 'adjective',
      ADV: 'adjective',
      CONJ: 'preposition',
      NOUN: 'noun',
      VERB: 'verb',
      DET: 'preposition',
      PRON: 'noun',
      PRT: 'punctuation',
      PUNCT: 'punctuation'
    }

  });

  _.extend(Editor.prototype, {

    constructor: Editor,

    reserve: function(note) {

      var list = this.schedule[note.type.partOfSpeech];

      if (!list) {
        return this;
      }

      var elem = list[list.index];
      if (!elem) {
        return this;
      }

      elem.startTime = this.currentTime;
      elem.note = note;

      if (this.schedule.indexOf(elem) < 0) {
        this.schedule.push(elem);
      }

      list.index = (list.index + 1) % list.length;

      return this;

    },

    update: function(time) {

      this.currentTime = time || Date.now();

      for (var i = 0; i < this.schedule.length; i++) {

        var elem = this.schedule[i];
        var note = elem.note;
        var type = note.type;
        var startTime = elem.startTime;
        var duration = note.duration * 1000;
        var elapsed = time - startTime;
        var pct = elapsed / duration;

        elem.style.color = lerpColor(type.color, black, pct);
        elem.style.borderColor = lerpColorAlpha(type.color, 1 - pct);

        if (pct >= 1) {
          this.schedule.splice(i, 1);
        }

      }

      return this;

    },

    setWidth: function(width) {
      var scope = this;
      this.width = width;
      this.domElement.style.width = width + 'px';
      requestAnimationFrame(function() {
        var rect = scope.domElement.getBoundingClientRect();
        scope.height = rect.height;
      });
      return this;
    },

    appendTo: function(elem) {

      elem.appendChild(this.domElement);
      return this;

    }

  });

  function lerpColorAlpha(a, t) {

    if (a in colors) {
      a = colors[a];
    } else if (_.isString(a)) {
      a = colors[a] = new THREE.Color(a);
    }

    return 'rgba('
      + Math.floor(255 * a.r) + ','
      + Math.floor(255 * a.g) + ','
      + Math.floor(255 * a.b) + ','
      + t + ')';

  }

  function lerpColor(a, b, t) {

    if (a in colors) {
      a = colors[a];
    } else if (_.isString(a)) {
      a = colors[a] = new THREE.Color(a);
    }

    if (b in colors) {
      b = colors[b]
    } else if (_.isString(b)) {
      b = colors[b] = new THREE.Color(b);
    }

    color.copy(a).lerp(b, t);

    return 'rgb('
      + Math.floor(255 * color.r) + ','
      + Math.floor(255 * color.g) + ','
      + Math.floor(255 * color.b) + ')';

  }

})(window);
