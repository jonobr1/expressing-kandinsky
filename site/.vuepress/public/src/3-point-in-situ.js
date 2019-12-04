var _ = Two.Utils;
var words = ['Today', 'I', 'am', 'going', 'to', 'the', 'movies'];

var text = two.makeText('Today I am going to the movies', 0, 0, {
  size: 20,
  color: '#333',
  family: 'futura-pt, Arial, sans-serif',
  weight: 700,
  baseline: 'middle',
  alignment: 'center'
});

text.position.set(two.width / 2, two.height / 2);

var elapsed = 0;
var index = 0;
var interval = 1000; // In milliseconds
var scale = 1;

reset();
update();

two.bind('update', function(frameCount, timeDelta) {

  text.scale += (scale - text.scale) * 0.33;

  if (!_.isNumber(timeDelta)) {
    return;
  }

  elapsed += timeDelta;
  var i = Math.floor(elapsed / interval);
  if (index !== i) {
    update();
    index = i;
  }

});

function update() {

  var phrase = '';

  for (var i = 0; i < words.index; i++) {
    if (i - 1 === words.pid) {
      phrase += capitalize(words[i]);
    } else {
      phrase += words[i];
    }
    if (i === words.pid) {
      phrase += '.';
    }
    phrase += ' ';
  }

  text.value = phrase;
  text.scale = 1;

  var width = two.width * 0.75;
  var rect = text.getBoundingClientRect();
  scale = width / rect.width;

  words.index++;

  if (words.index > words.length) {
    reset();
  }

}

function reset() {
  words.index = 0;
  words.pid = Math.floor(Math.random() * words.length) + 1;
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
