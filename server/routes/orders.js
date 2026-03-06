const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, isAdmin } = require('../middleware/auth');

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const orders = await Order.find({ UserId: req.user._id }).sort('-OrderDate');
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const orderData = { ...req.body, UserId: req.user._id };
        const order = await Order.create(orderData);
        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   GET /api/orders/all
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get('/all', protect, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find({}).sort('-OrderDate').populate('UserId', 'Username email');
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
