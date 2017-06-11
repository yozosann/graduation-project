<template>
  <div class="sellerinfo">
    <div class="tab">
      <div class="tab-item">
        <router-link to='/basic'>商家基本信息</router-link>
      </div>
      <div class="tab-item">
        <router-link to='/goods'>商家商品信息</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :sellerID="sellerID"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import basicinfo from '@/components/basicinfo/basicinfo.vue';
  import goodsinfo from '@/components/goodsinfo/goodsinfo.vue';
  
  export default {
    props: {
      sellerID: {
        type: String
      }
    },
    components: {
      basicinfo,
      goodsinfo
    }
  };

</script>

<style lang="stylus">
  @import './sellerinfo.styl';
</style>