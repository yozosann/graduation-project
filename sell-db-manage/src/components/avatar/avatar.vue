<template>
  <div class="avatar" :style="{ width: width + 'px', height: width + 'px' }">
    <img :src="item.avatar || item.image" alt="头像" :id="item._id">
    <div class="mask" @click="upload">
      <p>更改图像</p>
      <form id="file-form" runat="server" method="post" enctype="multipart/form-data" action="/upload">
        <div style="visibility:hidden">
          <input type="file" name="_f" :id="this.item._id + '-file'" @change="preview" @click.stop="" />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  const ERR_OK = 0;
  import { upload } from '@/common/js/upload.js';

  export default {
    props: {
      item: Object,
      width: Number,
      father: Object
    },
    methods: {
      upload() {
        document.getElementById(this.item._id + '-file').click();
      },
      preview(event) {
        upload(event, this, (response) => {
          response = response.body;
          if (response.errno === ERR_OK) {
            let pathArr = response.imagePath.split('/');
            let path = 'http://localhost:3000/' + pathArr[pathArr.length - 2] + '/' + pathArr[pathArr.length - 1];
            this.father.$emit('changeAvatar', path, this.item);
          } else {
            alert(response.data.message);
          }
        });
      }
    }
  };

</script>

<style lang="stylus">
  @import './avatar.styl';
</style>