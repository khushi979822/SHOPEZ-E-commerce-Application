const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a product title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    mainImg: {
        type: String,
        required: [true, 'Please provide the main image URL']
    },
    carousel: [{
        type: String
    }],
    Category: {
        type: String,
        required: true
    },
    sizes: [{
        type: String
    }],
    Gender: {
        type: String,
        default: 'Unisex'
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    Discount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
