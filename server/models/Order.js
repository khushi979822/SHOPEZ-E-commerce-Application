const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    Mobile: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    Pincode: {
        type: String,
        required: true
    },
    Title: {
        type: String,
        required: true
    },
    Desc: {
        type: String
    },
    Image: {
        type: String
    },
    Size: {
        type: String
    },
    Quantity: {
        type: Number,
        required: true,
        default: 1
    },
    Price: {
        type: Number,
        required: true
    },
    Discount: {
        type: Number,
        default: 0
    },
    PaymentMethod: {
        type: String,
        required: true
    },
    OrderDate: {
        type: Date,
        default: Date.now
    },
    Status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
