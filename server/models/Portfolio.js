const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    holdings: [
        {
            stockId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Stock',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 0
            },
            avgBuyPrice: {
                type: Number,
                required: true
            }
        }
    ],
    totalInvested: {
        type: Number,
        default: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

portfolioSchema.index({ userId: 1 });

module.exports = mongoose.model('Portfolio', portfolioSchema);
