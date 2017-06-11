<template>
  <div class="goodsinfo">
    <cover :isShow="isShow">
      <div class="slot">
        <div class="close" @click="close">X</div>
        <div class="hint">
          <p>点击分组名称即把食品加入到某个分组中，添加后分组将会多一份该商品到拷贝</p>
        </div>
        <ul class="goodlist">
          <li class="good-item" v-for="item in goods" @click='addFood(item)'>
            {{ item.name }}
          </li>
        </ul>
      </div>
    </cover>
    <div class="category">
      <p class="text">
        <span>商家种类信息：</span>
        <button class="button" @click="add('good')">添加新的种类</button>
        <button class="button" @click="selectDelete('good')">删除</button>
        <button class="button" @click="save">保存修改</button>
      </p>
      <ul class="good">
        <li class="item" v-for="(item, index) in goods">
          <deleteicon :isShow="isGoodDelete" :item="item" :father="_self"></deleteicon>
          <p class="name">
            <label :for="'name' + index">姓名：</label>
            <input type="text" :id="'name' + index" name="name" v-model="item.name">
          </p>
          <div class="support">
            <label :for="'type' + index">促销种类：</label>
            <select name="type" :id="'type' + index">
              <template v-for="type in types">
                <option v-if="item.type === type" :value="type" selected>
                  {{ type }}
                </option>
                <option v-else :value="type">
                  {{ type }}
                </option>
              </template>
            </select>
          </div>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper">
      <p class="text">
        <span>商品清单信息：</span>
        <button class="button" @click="add('food')">添加商品</button>
        <button class="button" @click="selectDelete('food')">删除</button>
        <button class="button" @click="save">保存修改</button>
      </p>
      <ul class="foods">
        <li class="item" v-for="item in foods">
          <deleteicon :isShow="isFoodDelete" :item="item" :father="_self"></deleteicon>
          <div class="base-content">
            <avatar :item="item" :width="140" :father="_self"></avatar>
            <div class="base">
              <p class="name">
                <label :for="'name' + item._id">姓名：</label>
                <input type="text" :id="'name' + item._id" name="name" v-model="item.name">
              </p>
              <p class="price">
                <label :for="'price'+ item._id">现价：</label>
                <input type="number" :id="'price'+ item._id" name="price" v-model="item.price" max="999" min="0">元
              </p>
              <p class="oldPrice">
                <label :for="'oldPrice'+ item._id">之前价：</label>
                <input type="number" :id="'oldPrice'+ item._id" name="oldPrice" v-model="item.oldPrice" max="999" min="0">元
              </p>
            </div>
          </div>
          <p class="description">
            <label :for="'description' + item._id">描述：</label>
            <input type="text" :id="'description' + item._id" name="description" v-model="item.description">
          </p>
          <p class="info">
            <label :for="'info'+ item._id" class="fortextarea">信息：</label>
            <textarea name="info" :id="'info'+ item._id" cols="40" rows="5" v-model="item.info"></textarea>
          </p>
          <p class="belong">此条商品信息所属分组：<span style="font-weight: bold">{{ item.belong }}</span></p>
          <div class="label-wrapper">
            <span>分组：</span>
            <span class="label" v-for="label in item.labels"> {{ label }} <span class="delete" @click.prevent="removeOut(item, label)"></span>            </span>
            <span class="label" style="font-weight: bold" @click="addTo(item)">添加到新的分组</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import deleteicon from '@/components/deleteicon/deleteicon.vue';
  import avatar from '@/components/avatar/avatar.vue';
  import cover from '@/components/cover/cover.vue';

  const ERR_OK = 0;

  export default {
    props: {
      sellerID: {
        type: String
      }
    },
    data() {
      return {
        goods: [],
        types: [-1, 0, 1, 2, 3, 4],
        isGoodDelete: false,
        isFoodDelete: false,
        noDuplicates: {},
        isShow: false,
        _self: this,
        addedFood: {},
        goodsCount: 0,
        foodsCount: 0
      };
    },
    methods: {
      _init() {
        if (this.sellerID === '') {
          return;
        }
        this.$http.get('http://localhost:3000/api/goods?id=' + this.sellerID).then(function (response) {
          response = response.body;
          if (response.errno === ERR_OK) {
            this.goods = response.data;
          }
        });
      },
      selectDelete(type) {
        if (type === 'good') {
          this.isGoodDelete = !this.isGoodDelete;
        } else {
          this.isFoodDelete = !this.isFoodDelete;
        }
      },
      add(type) {
        if (type === 'good') {
          let good = {};
          good.name = '新建分组' + ++this.goodsCount;
          good.type = -1;
          good.foods = [];
          this.goods.push(good);
        } else {
          let food = {
            name: '新建商品' + ++this.foodsCount,
            price: 10,
            oldPrice: 0,
            description: '',
            sellCount: 0,
            rating: 0,
            info: '',
            ratings: [],
            icon: 'http://static.galileo.xiaojukeji.com/static/tms/seller_avatar_256px.jpg',
            image: 'http://static.galileo.xiaojukeji.com/static/tms/seller_avatar_256px.jpg'
          };
          if (!this.goods[0]) {
            alert('没有分组不能创建食物');
            return;
          }
          this.goods[0].foods.unshift(food);
        }
      },
      removeOut(item, label) {
        let goods = this.goods.filter((good) => {
          return good.name === label;
        });
        goods[0].foods.forEach((food, index) => {
          if (food.name === item.name) {
            goods[0].foods.splice(index, 1);
          }
        }, this);
      },
      addTo(item) {
        this.isShow = true;
        this.addedFood = item;
      },
      close() {
        this.isShow = false;
      },
      addFood(item) {
        let isHaved = item.foods.find((food) => {
          return food === this.addedFood;
        });
        if (isHaved) {
          alert('刚商品已在分组里，请勿重复添加');
          this.addedFood = {};
          return;
        }
        item.foods.push(this.addedFood);
        this.addedFood = {};
        this.isShow = false;
      },
      save() {
        if (!confirm('确定保存商品分组及商品数据？')) {
          return;
        }

        this.$http.post('http://localhost:3000/api/save-goods/id=' + this.sellerID, JSON.stringify(this.goods)).then((response) => {
          response = response.body;
          if (response.errno === ERR_OK) {
            window.location.reload();
          } else {
            alert(response.data.message);
          }
        });
        console.log(this.goods);
      }
    },
    created() {
      this._init();
    },
    mounted() {
      this.$on('remove', function (item) {
        if (item.type !== undefined) {
          this.goods.forEach((good, index) => {
            if (good.name === item.name) {
              this.goods.splice(index, 1);
            }
          });
        } else {
          this.removeOut(item, item.belong);
        }
      });

      this.$on('changeAvatar', function (path, item) {
        item.image = path;
        // this.seller.avatar = path;
        console.log(item.image);
      });
    },
    computed: {
      foods() {
        this.noDuplicates = {};
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (this.noDuplicates[food.name] === undefined) {
              this.noDuplicates[food.name] = [];
              food.labels = this.noDuplicates[food.name];
              this.noDuplicates[food.name].push(good.name);
            } else {
              food.labels = this.noDuplicates[food.name];
              this.noDuplicates[food.name].push(good.name);
            }
            food.belong = good.name;
            foods.push(food);
          }, this);
        }, this);
        // console.log(foods);
        return foods;
      }
    },
    watch: {
      sellerID() {
        this._init();
      }
    },
    components: {
      deleteicon,
      avatar,
      cover
    }
  };

</script>

<style lang="stylus">
  @import './goodsinfo.styl';
</style>