(function() {

  var root = this;
  var previousXhr = root.xhr || {};

  var xhr = root.xhr = {

    noConflict: function() {
      root.xhr = previousXhr;
      return xhr;
    },

    get: function(url, callback) {

      var r = new XMLHttpRequest();
      r.open('GET', url);

      r.onreadystatechange = function() {
        if (r.readyState === 4 && r.status === 200) {
          callback(r.responseText);
        }
      };

      r.send();

      return r;

    },

    getBuffer: function(ctx, url, callback) {

      var r = new XMLHttpRequest();
      r.open('GET', url, true);
      r.responseType = 'arraybuffer';

      r.onload = function() {

        var success = function(buffer) {
          if (callback) {
            callback(buffer);
          }
        };

        var error = function(error) {
          console.error('decodeAudioData error', error);

          if (window.ga) {
            ga('send', 'event', 'video', 'binauralError', url);
          }
        };

        ctx.decodeAudioData(r.response, success, error);

      };

      r.send();

      return r;

    }

  };

})();
