const mongoose = require('mongoose');
const TYPES = mongoose.Schema.Types;

module.exports = {
    type: {
        type: TYPES.Number,
        required: true,
        enum: [0, 1, 2, 3, 4]
    },
    description: {
        type: TYPES.String,
        required: true
    }
}
