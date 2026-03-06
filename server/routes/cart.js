const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protect } = require('../middleware/auth');

// @route   GET /api/cart
// @desc    Get logged in user's cart
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const cartItems = await Cart.find({ UserId: req.user._id });
        res.json({ success: true, data: cartItems });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, mainImg, Quantity, size, price, Discount } = req.body;

        // Check if item already exists in cart for this size/product
        let cartItem = await Cart.findOne({ UserId: req.user._id, title, size });

        if (cartItem) {
            cartItem.Quantity += Number(Quantity);
            await cartItem.save();
        } else {
            cartItem = await Cart.create({
                UserId: req.user._id,
                title,
                description,
                mainImg,
                Quantity,
                size,
                price,
                Discount
            });
        }
        res.status(201).json({ success: true, data: cartItem });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/cart/:id
// @desc    Remove item from cart
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const cartItem = await Cart.findOne({ _id: req.params.id, UserId: req.user._id });
        if (!cartItem) return res.status(404).json({ success: false, message: 'Cart item not found' });

        await cartItem.deleteOne();
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/cart
// @desc    Clear user cart
// @access  Private
router.delete('/', protect, async (req, res) => {
    try {
        await Cart.deleteMany({ UserId: req.user._id });
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
