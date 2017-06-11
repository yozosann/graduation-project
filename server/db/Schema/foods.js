const mongoose = require('mongoose');
const TYPES = mongoose.Schema.Types;

const ratings = require('./ratings');
const RatingsSchema = new mongoose.Schema(ratings);

module.exports = {
  name: {
    type: TYPES.String,
    required: true
  },
  price: {
    type: TYPES.Number,
    required: true,
    min: 0
  },
  oldPrice: {
    type: TYPES.Number,
    min: 0
  },
  description: {
    type: TYPES.String
  },
  sellCount: {
    type: TYPES.Number,
    required: true,
    min: 0
  },
  rating: {
    type: TYPES.Number
  },
  info: {
    type: TYPES.String
  },
  ratings: [RatingsSchema],
  icon: {
    type: TYPES.String,
    required: true
  },
  image: {
    type: TYPES.String,
    required: true
  }
}