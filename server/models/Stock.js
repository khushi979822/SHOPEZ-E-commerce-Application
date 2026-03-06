const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    sector: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    previousClose: {
        type: Number,
        default: 0
    },
    change: {
        type: Number,
        default: 0
    },
    changePercent: {
        type: Number,
        default: 0
    },
    dayHigh: {
        type: Number,
        default: 0
    },
    dayLow: {
        type: Number,
        default: 0
    },
    volume: {
        type: Number,
        default: 0
    },
    marketCap: {
        type: String,
        default: ''
    },
    historicalData: [
        {
            date: { type: Date },
            open: { type: Number },
            high: { type: Number },
            low: { type: Number },
            close: { type: Number },
            volume: { type: Number }
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

stockSchema.index({ symbol: 1 });
stockSchema.index({ sector: 1 });
stockSchema.index({ name: 'text', symbol: 'text' });

module.exports = mongoose.model('Stock', stockSchema);
