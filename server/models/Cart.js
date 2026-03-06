const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    mainImg: {
        type: String,
        required: true
    },
    Quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    size: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    Discount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);
