<template>
  <div ref="stage" class="contemplation"></div>
</template>

<script>

  module.exports = {
    name: 'Contemplation',
    props: {
      type: {
        type: String,
        default: 'CanvasRenderer'
      },
      sketch: {
        type: String,
        default: ''
      }
    },
    mounted: function() {

      import('@jonobr1/two.js').then(resp => {

        var Two = resp.default;

        var rect = this.$refs.stage.getBoundingClientRect();
        var startWidth = rect.width;
        var startHeight = Math.max(rect.height, 480);

        var two = this.two = new Two({
          type: this.type,
          width: startWidth,
          height: startHeight
        }).appendTo(this.$refs.stage);

        this.resize = (e) => {

          var rect = this.$refs.stage.getBoundingClientRect();
          var width = rect.width
          var height = Math.min(rect.height, startHeight);

          two.width = width;
          two.height = height;
          two.renderer.setSize(width, height);

        };
        window.addEventListener('resize', this.resize, false);

        this.scroll = debounce(scroll, 50, this);
        document.body.addEventListener('wheel', this.scroll, false);
        this.scroll();

        if (this.sketch) {

          // Load prioritized sketch file
          var xhr = new XMLHttpRequest();
          xhr.open('GET', this.sketch);
          xhr.onload = (resp) => {
            invoke(xhr.response);
          };
          xhr.send();


        } else if (this.$slots.default && this.$slots.default.length > 0) {

          // Load innerHTML'd code
          for (var i = 0; i < this.$slots.default.length; i++) {
            var slot = this.$slots.default[i];
            if (slot.text) {
              invoke(slot.text);
            }
          }

        }

        function scroll() {

          var rect = this.$refs.stage.getBoundingClientRect();
          var isVisible = rect.bottom > 0 && rect.top < window.innerHeight
            && rect.right > 0 && rect.left < window.innerWidth;

          if (isVisible && !two.playing) {
            two.play();
          } else if (!isVisible && two.playing) {
            two.pause();
          }

        }

        function invoke(code) {
          try {
            new Function('two', code)(two);
          } catch (e) {
            console.warn('Contemplation.vue', e);
          }
        }

      });

    },
    beforeDestroyed: function() {
      window.removeEventListener('resize', this.resize, false);
      var two = this.two;
      if (two.playing) {
        two.pause();
        Two.Utils.release(two.scene);
      }
    }
  };

  function debounce(func, delay, ctx) {

    var timeout;

    function callback() {
      func.apply(ctx, arguments);
    };

    return function() {

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(callback, delay);

    };

  }

</script>

<style lang="less" scoped>

  div.contemplation {

    border: 1px solid #ccc;
    position: relative;

    svg, canvas {
      display: block;
    }

  }

</style>
