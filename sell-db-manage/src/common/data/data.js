export default {
  'name': '重置店铺', // 名字
  'description': '',  // 描述
  'deliveryTime': 6,
  'score': 5,
  'serviceScore': 5,
  'foodScore': 5,
  'rankRate': 0,
  'minPrice': 0,  // 起送价
  'deliveryPrice': 0, // 运费
  'ratingCount': 0,
  'sellCount': 0,
    // 公告
  'bulletin': '无',
    // 支持项
  'supports': [
    {
            // 减
      'type': 0,
      'description': '在线支付满28减5'
    },
    {
            // 折
      'type': 1,
      'description': 'VC无限橙果汁全场8折'
    },
    {
            // 特
      'type': 2,
      'description': '单人精彩套餐'
    },
    {
            // 票
      'type': 3,
      'description': '该商家支持发票,请下单写好发票抬头'
    },
    {
            // 保
      'type': 4,
      'description': '已加入“外卖保”计划,食品安全保障'
    }
  ],
    // 头像
  'avatar': 'http://static.galileo.xiaojukeji.com/static/tms/seller_avatar_256px.jpg',
    // 店内照片
  'pics': [],
    // 商家信息
  'infos': [],
  'goods': [
    {
      'name': '默认分组',
      'type': -1,
      'foods': []
    }
  ],
  'ratings': []
};