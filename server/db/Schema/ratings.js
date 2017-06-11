const mongoose = require('mongoose');
const TYPES = mongoose.Schema.Types;

module.exports = {
  username: {
    type: TYPES.String,
    required: true
  },
  rateTime: {
    type: TYPES.Date,
    required: true
  },
  rateType: {
    type: TYPES.Number,
    required: true,
    enum: [0, 1, 2]
  },
  text: {
    type: TYPES.String
  },
  avatar: {
    type: TYPES.String,
    required: true
  }
}