let express = require('express');
let db = require('./db/db');
let path = require('path');
let app = express();
let bodyParser = require('body-parser');
let fs = require('fs');
let imgIndex = 0;

// need it...  
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ "limit": 1024 * 3 + "kb" })); // for parsing application/json
app.use(express.static('public'));

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  // res.header("Content-Type", "application/json;charset=utf-8");
  // res.header("Content-Type", "text/html; charset=utf-8");
  next();
});

let apiRoutes = express.Router();

apiRoutes.get('/seller', function (req, res) {
  db.find(req.query.id, function (err, result) {
    if (err) {
      console.log('Error:' + err);
      return;
    } else {
      let seller = result[0].toObject();
      delete seller.goods;
      delete seller.ratings;

      res.json({
        errno: 0,
        data: seller
      });
    }
  });
});

apiRoutes.get('/goods', function (req, res) {
  db.find(req.query.id, function (err, result) {
    if (err) {
      console.log('Error:' + err);
      return;
    } else {
      res.json({
        errno: 0,
        data: result[0].toObject().goods
      });
    }
  });
});

apiRoutes.get('/ratings', function (req, res) {
  db.find(req.query.id, function (err, result) {
    if (err) {
      console.log('Error:' + err);
      return;
    } else {
      res.json({
        errno: 0,
        data: result[0].toObject().ratings
      });
    }
  });
});

apiRoutes.get('/list', function (req, res) {
  db.findWith({}, '_id name', function (err, result) {
    if (err) {
      console.log('Error:' + err);
      return;
    } else {
      res.json({
        errno: 0,
        data: result
      });
    }
  });
});

apiRoutes.post('/create', function (req, res) {
  var seller = req.body;
  db.create(seller, function (err, result) {
    if (err) {
      res.json({
        errno: 1,
        data: err
      });
    } else {
      res.json({
        errno: 0,
        id: result._id
      });
    }
  });
});

apiRoutes.post('/upload', function (req, res) {
  let base64Date = req.body.img.replace(/^data:image\/\w+;base64,/, "");
  let dataBuffer = new Buffer(base64Date, 'base64');
  let imagePath = path.join(__dirname + '/public/image', 'img' + ((++imgIndex) > 9 ? imgIndex : '0' + imgIndex) + '.' + req.body.imgType);
  fs.writeFile(imagePath, dataBuffer, (err) => {
    if (err) {
      res.json({
        errno: 1,
        data: err
      });
      return;
    } else {
      res.json({
        errno: 0,
        imagePath
      });
    }
  });
});

apiRoutes.delete('/delete/:id', function (req, res) {
  // console.log(req.param('id').slice(3));
  let id = req.param('id').slice(3);
  db.removeOne(id, function (err, result) {
    if (err) {
      res.json({
        errno: 1,
        data: err
      });
    } else {
      res.json({
        errno: 0
      });
    }
  });
});

apiRoutes.post('/save', function (req, res) {
  let seller = req.body;
  // 格式化名字
  seller.name = seller.name.slice(0, 12);

  // 格式化描述
  seller.description = seller.description.slice(0, 12);

  // 格式化公告
  seller.bulletin = seller.bulletin.slice(0, 140);

  // 格式化最小起送价
  seller.minPrice = Number(seller.minPrice);
  if (seller.minPrice > 9999) {
    seller.minPrice = 9999;
  }

  // 格式化邮费
  seller.deliveryPrice = Number(seller.deliveryPrice);
  if (seller.deliveryPrice > 999) {
    seller.deliveryPrice = 999;
  }

  // 格式化商家信息
  seller.infos = seller.infos.split('\n');
  seller.infos = seller.infos.slice(0, 8);
  for (let i = seller.infos.length - 1 > 7 ? 7 : seller.infos.length - 1; i >= 0; i--) {
    seller.infos[i].slice(0, 20);
    if (!seller.infos[i]) {
      seller.infos.splice(i, 1);
    }
  }

  // 格式化支持款项
  for (let i = seller.supports.length - 1; i >= 0; i--) {
    seller.supports[i].description.slice(0, 12);
    if (!seller.supports[i].description) {
      seller.supports.splice(i, 1);
    }
  }

  db.findById(seller._id, function (err, doc) {
    doc.set(seller);
    doc.save(function (err) {
      if (err) {
        res.json({
          errno: 1,
          data: err
        });
      } else {
        res.json({
          errno: 0
        });
      }
    })
  });
});

apiRoutes.post('/reset', function (req, res) {
  let seller = req.body;

  db.findById(seller._id, function (err, doc) {
    doc.set(seller);
    doc.save(function (err) {
      if (err) {
        console.log(err);
        res.json({
          errno: 1,
          data: err
        });
      } else {
        res.json({
          errno: 0
        });
      }
    })
  });
});

apiRoutes.post('/save-goods/:id', function (req, res) {
  let goods = req.body;
  let id = req.param('id').slice(3);
  // 分组及商品信息格式化
  goods.forEach((good) => {
    good.name = good.name.slice(0, 12);
    good.foods.forEach((food) => {

      food.name = food.name.slice(0, 12);

      food.description = food.description.slice(0, 12);

      food.info = food.info.slice(0, 140);

      // 格式化最小起送价
      food.minPrice = Number(food.minPrice);
      if (food.minPrice > 9999) {
        food.minPrice = 9999;
      }

      // 格式化邮费
      food.deliveryPrice = Number(food.deliveryPrice);
      if (food.deliveryPrice > 999) {
        food.deliveryPrice = 999;
      }
    })
  })

  db.findById(id, function (err, doc) {
    doc.goods = goods;
    doc.save(function (err) {
      if (err) {
        res.json({
          errno: 1,
          data: err
        });
      } else {
        res.json({
          errno: 0
        });
      }
    })
  });
});

app.use('/api', apiRoutes);

app.listen(3000);
console.log('Listening on port 3000...');