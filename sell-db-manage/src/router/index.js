import Vue from 'vue';
import Router from 'vue-router';
import basicinfo from '@/components/basicinfo/basicinfo.vue';
import goodsinfo from '@/components/goodsinfo/goodsinfo.vue';

Vue.use(Router);

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/basic',
      component: basicinfo,
      alias: '/'
    },
    {
      path: '/goods',
      component: goodsinfo
    }
  ]
});
