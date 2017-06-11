const mongoose = require('mongoose');
const db = mongoose.createConnection('localhost', 'test');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("we're connected!");
});

const TYPES = mongoose.Schema.Types;

const SellerSchema = new mongoose.Schema(require('./Schema/seller'));

var SellerModel = db.model('Seller', SellerSchema);
// var seller = new SellerModel(require('./data'));

// seller.save(function (err, result) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(result);
//   }
// });

SellerModel.find({'_id': '591a8ffafb1898146ba80638'}, '-_id -__v', function (err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log(result[0]);
    console.log(result[0].ratings);
  }
}); 