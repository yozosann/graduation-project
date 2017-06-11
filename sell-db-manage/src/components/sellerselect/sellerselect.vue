<template>
  <div class="sellerselect">
    <cover :isShow="isShow">
      <div class="slot">
        <p class="item">
          <label for="name">店名：</label>
          <input type="text" id="name" name="name" v-model="sourceData.name">
        </p>
        <p class="item">
          <label for="deliveryPrice">运费：</label>
          <input type="number" id="deliveryPrice" name="deliveryPrice" max="999" min="0" v-model="sourceData.deliveryPrice">元
        </p>
        <p class="item">
          <label for="minPrice">起送价：</label>
          <input type="number" id="minPrice" name="minPrice" max="9999" min="0" v-model="sourceData.minPrice">元
        </p>
        <div class="buttom-wrapper">
          <button class="button" @click="create">确认创建</button>
          <button class="button" @click="hideMask">取消</button>
        </div>
      </div>
    </cover>
    <div class="current">
      当前商家：
      <span class="text">{{ currentSeller.name }}
      </span>
    </div>
    <div class="select">
      <button class="button" @click="enter">进入当前商家界面</button>
      <button class="button" @click="showMask">创建新的商家</button>
      <button class="button" @click="deleteOne">删除该商家</button>
      <button class="button" @click="reset" title="将一个商家的所有信息改变为新创建状态">置空</button>
      <span class="text">选择其他商家：</span>
      <input type="text" class="selectinput" @click.prevent="" @input="inputName" ref="selectinput" />
      <ul class="select-list" v-show="isShowlist" @click.prevent="">
        <li class="list-item" v-for="item in currentList" @click="selectSeller(item)">
          {{ Object(item).name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  // import Vue from 'vue';
  import cover from '@/components/cover/cover.vue';
  import sourceData from '@/common/data/data.js';
  const ERR_OK = 0;

  export default {
    props: {
      list: {
        type: Array
      },
      father: {
        type: Object
      },
      currentID: {
        type: String
      }
    },
    components: {
      cover
    },
    data() {
      return {
        currentSeller: {},
        isShowlist: false,
        currentList: [],
        isShow: false,
        sourceData
      };
    },
    watch: {
      list() {
        this._initList();
      }
    },
    created() {
      this._initList();
    },
    mounted() {
      document.body.onclick = function () {
        this.isShowlist = false;
      }.bind(this);
    },
    methods: {
      _initList() {
        // console.log(this.currentID);
        this.$nextTick(() => {
          this.setAllitem();
          // 不然会报错
          let seller = this.list.find((seller) => {
            return seller._id === this.currentID;
          });
          this.currentSeller = Object(seller);
        });
      },
      selectSeller(item) {
        this.currentSeller = Object(item);
        this.isShowlist = false;
        this.$refs.selectinput.value = this.currentSeller.name;
        history.replaceState(200, '', '/seller?id=' + this.currentSeller._id);
        this.father.$emit('selectSeller', this.currentSeller);
      },
      inputName() {
        this.setAllitem();
        let currentValue = this.$refs.selectinput.value;
        if (currentValue === '') {
          this.setAllitem();
        } else {
          this.isShowlist = true;
        }
        this.currentList = this.currentList.filter((item) => {
          return item.name.indexOf(currentValue) !== -1;
        });
      },
      setAllitem() {
        this.currentList = this.list.map((item) => {
          let newItem = Object(item);
          return newItem;
        });
      },
      enter() {
        let id = this.currentSeller._id;
        // console.log(id);
        window.open('http://localhost:8080/seller?id=' + id);
      },
      showMask() {
        this.isShow = true;
      },
      hideMask() {
        this.isShow = false;
      },
      create() {
        let formData = JSON.stringify(this.sourceData);
        // log(formData);
        this.$http.post('http://localhost:3000/api/create', formData).then((response) => {
          response = response.body;
          if (response.errno === ERR_OK) {
            window.location = 'http://localhost:8081/seller?id=' + response.id;
          } else {
            alert(response.data.message);
          }
        });
      },
      deleteOne() {
        if (!confirm('确定重置该商家?')) {
          return;
        }
        this.$http.delete('http://localhost:3000/api/delete/id=' + this.currentSeller._id).then(function (response) {
          response = response.body;
          if (response.errno === ERR_OK) {
            window.location = 'http://localhost:8081/';
          } else {
            alert(response.data.message);
          }
        });
      },
      reset() {
        if (!confirm('确定保存数据？')) {
          return;
        }

        let newSeller = this.sourceData;
        newSeller._id = this.currentID;
        this.$http.post('http://localhost:3000/api/reset', JSON.stringify(newSeller)).then((response) => {
          response = response.body;
          if (response.errno === ERR_OK) {
            window.location.reload();
          } else {
            alert(response.data.message);
          }
        });
      }
    }
  };

</script>

<style lang="stylus">
  @import './sellerselect.styl';
</style>