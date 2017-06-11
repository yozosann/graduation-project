const mongoose = require('mongoose');
const db = mongoose.createConnection('localhost', 'test');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("we're connected!");
});

// const SellerSchema = mongoose.Schema({}, {
//   collection: "sellers"
// });
const SellerSchema = new mongoose.Schema(require('./Schema/seller'));
const SellerModel = db.model('Seller', SellerSchema);

module.exports = {
  find: function (id, cb) {
    SellerModel.find({ '_id': id }, '-__v', cb);
  },
  findWith: function (obj, str, cb) {
    SellerModel.find(obj, str, cb);
  },
  create: function (obj, cb) {
    var seller = new SellerModel(obj);
    seller.save(cb);
  },
  removeOne: function (id, cb) {
    SellerModel.remove({ '_id': id }, cb);
  },
  findById: function (id, cb) {
    SellerModel.findById({ '_id': id }, cb);
  }
}  