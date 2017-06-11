const mongoose = require('mongoose');
const TYPES = mongoose.Schema.Types;

const foods = require('./foods');
const FoodsSchema = new mongoose.Schema(foods);

module.exports = {
  name: {
    type: TYPES.String,
    required: true
  },
  type: {
    type: TYPES.Number,
    required: true,
    enum: [-1, 0, 1, 2, 3, 4]
  },
  foods: [FoodsSchema]
}