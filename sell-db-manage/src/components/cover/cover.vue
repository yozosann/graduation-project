<template>
  <div class="cover" v-show="isShow" ref="cover">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      isShow: Boolean
    },
    methods: {
      notScroll() {
        let isIE = navigator.userAgent.match(/MSIE (\d)/i);
        isIE = isIE ? isIE[1] : undefined;
        let isFF = /FireFox/i.test(navigator.userAgent);
        // 获取元素
        let counter = this.$refs.cover;
        // 鼠标滚轮事件
        // 传统浏览器使用MouseWheel事件
        if (isIE < 9) {
          counter.attachEvent('onmousewheel', function () {
            // console.log('ie');
            // 阻止浏览器默认方法
            return false;
          });
          // 除火狐外的现代浏览器也使用MouseWheel事件
        } else if (!isFF) {
          counter.addEventListener('mousewheel', function (e) {
            // 阻止浏览器默认方法
            e.preventDefault();
            // console.log(v);
          }, false);
          // 奇葩的火狐使用DOMMouseScroll事件
        } else {
          counter.addEventListener('DOMMouseScroll', function (e) {
            // 阻止浏览器默认方法
            e.preventDefault();
            // console.log('ff');
          }, false);
          // window.addEventListener('scroll', this.pe);
        }
      }
    },
    watch: {
      isShow(newVal) {
        if (newVal === true) {
          this.notScroll();
        }
      }
    }
  };

</script>

<style lang="stylus">
  @import './cover.styl';
</style>