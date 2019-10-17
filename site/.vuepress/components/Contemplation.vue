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
        var two = this.two = new Two({
          type: this.type,
          width: rect.width,
          height: Math.max(rect.height, 480),
          autostart: true
        }).appendTo(this.$refs.stage);

        this.resize = (e) => {

          var rect = this.$refs.stage.getBoundingClientRect();
          var width = Math.min(rect.width, two.width);
          var height = Math.min(rect.height, two.height);

          two.width = width;
          two.height = height;
          two.renderer.setSize(width, height);

        };
        window.addEventListener('resize', this.resize, false);

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
