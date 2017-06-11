<template>
  <div class="basicinfo">
    <cover :isShow="isShow">
      <div class="slot">
        <img :src="lookedImage" alt="展示" @click.stop="">
      </div>
    </cover>
    <div class="base">
      <avatar :item="seller" :width="256" :father="_self"></avatar>
      <div class="message">
        <p class="item">
          <label :for="'name'+seller.name">姓名：</label>
          <input type="text" :id="'name'+seller.name" name="name" v-model="seller.name">
        </p>
        <p class="item">
          <label for="description">描述：</label>
          <input type="text" id="description" name="description" v-model="seller.description">
        </p>
        <p class="item">
          <label for="bulletin">公告：</label>
          <textarea name="bulletin" id="bulletin" cols="50" rows="7" v-model="seller.bulletin"></textarea>
        </p>
      </div>
    </div>
    <div class="other">
      <div class="other-message">
        <div class="fee">
          <p class="item">
            <label for="_minPrice">起送价：</label>
            <input type="number" id="_minPrice" name="minPrice" v-model="seller.minPrice" max="9999" min="0">元
          </p>
          <p class="item">
            <label for="_deliveryPrice">运费：</label>
            <input type="number" id="_deliveryPrice" name="deliveryPrice" v-model="seller.deliveryPrice" max="999" min="0">元
          </p>
        </div>
        <div class="infos ">
          <p class="item">
            <label for="infos">商家信息：</label>
            <textarea name="infos" id="infos" cols="50" rows="7" v-model="seller.infos"></textarea>
          </p>
        </div>
        <div class="supports">
          <p class="item" v-for="(item, index) in seller.supports">
            <label :for="'desc' + index">{{ supportsName[item.type] }}：</label>
            <input v-if="item.description !== ''" type="checkbox" :value="item.type" name="type" id="type" checked>
            <input v-else type="checkbox" :value="item.type" name="type" id="type" disabled>
            <input type="text" v-model="item.description" name="desc" :id="'desc' + index">
          </p>
        </div>
      </div>
      <div class="tip">
        <ol>
          <li v-for="item in tip">{{ item }}</li>
        </ol>
      </div>
    </div>
    <div class="album-wrapper ">
      相册：
      <ul class="album">
        <li class="img-item" v-for="item in seller.pics" @click.stop="look(item)">
          <div class="mask">
            <div class="delete" @click.stop="deleteAlbumPhoto(item)">X</div>
          </div>
          <img :src="item" :alt="item">
        </li>
        <li class="img-add" v-show="Array(seller.pics).length <= 12" @click="addImage">
          <form runat="server" method="post" enctype="multipart/form-data">
            <div style="visibility:hidden">
              <input type="file" name="" id="addImage" @change="preview" @click.stop="" />
            </div>
          </form>
        </li>
      </ul>
    </div>
    <div class="button-wrapper">
      <button class="submit" @click="save">保存</button>
    </div>
  </div>
</template>

<script>
  const ERR_OK = 0;
  // const MAX_SIZE = 1024 * 1024 * 3;
  import cover from '@/components/cover/cover.vue';
  import avatar from '@/components/avatar/avatar.vue';
  import { upload } from '@/common/js/upload.js';

  export default {
    props: {
      sellerID: {
        type: String
      }
    },
    data() {
      return {
        seller: {},
        supportsName: ['减', '折', '特', '票', '保'],
        tip: [
          '姓名，描述最长为12个字',
          '公告最长为140个字',
          '商家信息每条以回车（自动换行不影响）分隔',
          '商家信息每条不超过20个字',
          '商家信息不能超过8条',
          '商家信息建议包含开店时间，种类，实体店地点，是否能开发票等',
          '减折特票保不勾不写视为不参加此活动，提示信息不超过20个字',
          '起送价不能超过9999元，运费不能超过999元'
        ],
        isShow: false,
        _self: this,
        lookedImage: ''
      };
    },
    methods: {
      _init() {
        if (this.sellerID === '') {
          return;
        }
        this.$http.get('http://localhost:3000/api/seller?id=' + this.sellerID).then(function (response) {
          response = response.body;
          if (response.errno === ERR_OK) {
            this.seller = response.data;

            this.seller.infos = this.seller.infos.join('\n');

            if (this.seller.supports.length < 5) {
              this.replenishSupport();
            }
          }
        });
      },
      replenishSupport() {
        let all = new Set([0, 1, 2, 3, 4]);
        let own = [];
        for (let i = 0; i < this.seller.supports.length; i++) {
          own.push(this.seller.supports[i].type);
        }
        own = new Set(own);

        let difference = [...all].filter((val) => {
          return !own.has(val);
        });
        own = [...own];

        let copySupports = [];
        while (own.length && difference.length) {
          if (own[0] <= difference[0]) {
            copySupports.push(this.createSupport(own[0], this.seller.supports[own[0]].description));
            own.shift();
          } else {
            copySupports.push(this.createSupport(difference[0], ''));
            difference.shift();
          }
        }
        while (own.length) {
          copySupports.push(this.createSupport(own[0], this.seller.supports[own[0]].description));
          own.shift();
        }
        while (difference.length) {
          copySupports.push(this.createSupport(difference[0], ''));
          difference.shift();
        }

        this.seller.supports = copySupports;
      },
      addImage() {
        document.getElementById('addImage').click();
      },
      preview(event) {
        upload(event, this, (response) => {
          response = response.body;
          if (response.errno === ERR_OK) {
            let pathArr = response.imagePath.split('/');
            let path = 'http://localhost:3000/' + pathArr[pathArr.length - 2] + '/' + pathArr[pathArr.length - 1];
            this.seller.pics.push(path);
          } else {
            alert(response.data.message);
          }
        });
      },
      look(item) {
        this.isShow = true;
        this.lookedImage = item;
        document.body.addEventListener('click', () => {
          this.isShow = false;
        });
      },
      deleteAlbumPhoto(item) {
        if (!confirm('你确定将改图片从相册中删除吗？')) {
          return;
        }

        for (let i = this.seller.pics.length - 1; i >= 0; i--) {
          if (this.seller.pics[i] === item) {
            this.seller.pics.splice(i, 1);
          }
        }
      },
      save() {
        if (!confirm('确定保存数据？')) {
          return;
        }

        this.$http.post('http://localhost:3000/api/save', JSON.stringify(this.seller)).then((response) => {
          response = response.body;
          if (response.errno === ERR_OK) {
            window.location.reload();
          } else {
            alert(response.data.message);
          }
        });
      },
      createSupport(type, desc) {
        let temp = {};
        temp.type = type;
        temp.description = desc;
        return temp;
      }
    },
    created() {
      this._init();
    },
    watch: {
      sellerID() {
        this._init();
      }
    },
    mounted() {
      this.$on('changeAvatar', function (path) {
        this.seller.avatar = path;
        console.log(this.seller.avatar);
      });
    },
    components: {
      avatar,
      cover
    }
  };

</script>

<style lang="stylus">
  @import './basicinfo.styl';
</style>