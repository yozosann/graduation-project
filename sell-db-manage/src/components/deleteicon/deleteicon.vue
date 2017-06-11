<template>
  <div class="deleteicon" v-show="isShow" @click="remove(item)"></div>
</template>

<script>
  export default {
    props: {
      isShow: Boolean,
      item: Object,
      father: Object
    },
    methods: {
      remove(item) {
        if (!confirm('确定删除? :d 分组删除后，所属分组的食物将一并消失')) {
          return;
        }
        this.father.$emit('remove', item);
      }
    }
  };

</script>

<style lang="stylus">
  @import './deleteicon.styl';
</style>