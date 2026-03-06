const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    Categories: [{
        type: String,
        required: true
    }],
    Banner: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Admin', adminSchema);
