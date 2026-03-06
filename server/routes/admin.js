const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const { protect, isAdmin } = require('../middleware/auth');

// @route   GET /api/admin/config
// @desc    Get site config (Banners/Categories)
// @access  Public
router.get('/config', async (req, res) => {
    try {
        const config = await Admin.findOne({});
        res.json({ success: true, data: config });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/admin/config
// @desc    Update site config
// @access  Private/Admin
router.post('/config', protect, isAdmin, async (req, res) => {
    try {
        let config = await Admin.findOne({});
        if (config) {
            config.Categories = req.body.Categories || config.Categories;
            config.Banner = req.body.Banner || config.Banner;
            await config.save();
        } else {
            config = await Admin.create(req.body);
        }
        res.json({ success: true, data: config });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
