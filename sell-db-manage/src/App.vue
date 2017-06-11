<template>
  <div id="app">
    <v-header></v-header>
    <sellerselect :list="list" :father="_self" :currentID="sellerID"></sellerselect>
    <sellerinfo :sellerID="sellerID"></sellerinfo>
  </div>
</template>

<script>
  import header from '@/components/header/header.vue';
  import sellerselect from '@/components/sellerselect/sellerselect.vue';
  import sellerinfo from '@/components/sellerinfo/sellerinfo.vue';
  import { urlParse } from '@/common/js/util';
  const ERR_OK = 0;

  export default {
    name: 'app',
    data() {
      return {
        list: [],
        _self: this,
        sellerID: ''
      };
    },
    components: {
      'v-header': header,
      sellerselect,
      sellerinfo
    },
    created() {
      this.$http.get('http://localhost:3000/api/list').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          console.log(response.data);
          this.list = response.data;
          let queryParam = urlParse();
          if (queryParam.id) {
            this.sellerID = queryParam.id;
          } else {
            this.sellerID = this.list[0]._id;
          }
        }
      });
    },
    mounted() {
      this.$on('selectSeller', function (seller) {
        this.sellerID = Object(seller)._id;
      });
    }
  };

</script>

<style lang="stylus">
  @import './App.styl';
</style>