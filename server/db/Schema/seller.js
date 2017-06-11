const mongoose = require('mongoose');
const TYPES = mongoose.Schema.Types;

const support = require('./support');
const SupportSchema = new mongoose.Schema(support);

const goods = require('./goods');
const GoodsSchema = new mongoose.Schema(goods);

const ratings = require('./ratings');
Object.assign(ratings, {
  deliveryTime: {
    type: TYPES.Number
  },
  score: {
    type: TYPES.Number,
    require: true,
    min: 0,
    max: 5
  },
  recommend: {
    type: [TYPES.String]
  }
});
const RatingsSchema = new mongoose.Schema(ratings);

module.exports = {
  name: {
    type: TYPES.String,
    required: true
  },
  description: {
    type: TYPES.String
  },
  deliveryTime: {
    type: TYPES.Number,
    required: true
  },
  score: {
    type: TYPES.Number,
    required: true,
    min: 0,
    max: 5
  },
  serviceScore: {
    type: TYPES.Number,
    required: true,
    min: 0,
    max: 5
  },
  foodScore: {
    type: TYPES.Number,
    required: true,
    min: 0,
    max: 5
  },
  rankRate: {
    type: TYPES.Number,
    required: true,
    min: 0,
    max: 100
  },
  minPrice: {
    type: TYPES.Number,
    required: true,
    min: 0,
    max: 100
  },
  deliveryPrice: {
    type: TYPES.Number,
    required: true,
    min: 0,
    max: 100
  },
  ratingCount: {
    type: TYPES.Number,
    required: true,
    min: 0,
    default: 0
  },
  sellCount: {
    type: TYPES.Number,
    required: true,
    min: 0,
    default: 0
  },
  bulletin: {
    type: TYPES.String,
    required: true
  },
  supports: [SupportSchema],
  avatar: {
    type: TYPES.String,
    default: "http://static.galileo.xiaojukeji.com/static/tms/seller_avatar_256px.jpg"
  },
  pics: {
    type: [TYPES.String]
  },
  infos: {
    type: [TYPES.String]
  },
  goods: [GoodsSchema],
  ratings: [RatingsSchema]
}