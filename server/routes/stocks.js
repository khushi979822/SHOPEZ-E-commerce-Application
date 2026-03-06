const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const { protect, isAdmin } = require('../middleware/auth');

// @route   GET /api/stocks
// @desc    Get all stocks with optional search and filter
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { search, sector, sort } = req.query;
        let query = { isActive: true };

        if (search) {
            query.$or = [
                { symbol: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
            ];
        }

        if (sector && sector !== 'All') {
            query.sector = sector;
        }

        let sortOption = { symbol: 1 };
        if (sort === 'price_asc') sortOption = { price: 1 };
        if (sort === 'price_desc') sortOption = { price: -1 };
        if (sort === 'change_desc') sortOption = { changePercent: -1 };
        if (sort === 'change_asc') sortOption = { changePercent: 1 };
        if (sort === 'name') sortOption = { name: 1 };

        const stocks = await Stock.find(query).sort(sortOption).select('-historicalData');
        res.json({ success: true, count: stocks.length, data: stocks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/stocks/sectors
// @desc    Get unique sectors
// @access  Public
router.get('/sectors', async (req, res) => {
    try {
        const sectors = await Stock.distinct('sector', { isActive: true });
        res.json({ success: true, data: sectors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/stocks/:id
// @desc    Get single stock with historical data
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const stock = await Stock.findById(req.params.id);
        if (!stock) {
            return res.status(404).json({ success: false, message: 'Stock not found' });
        }
        res.json({ success: true, data: stock });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/stocks
// @desc    Add a new stock (admin only)
// @access  Private/Admin
router.post('/', protect, isAdmin, async (req, res) => {
    try {
        const stock = await Stock.create(req.body);
        res.status(201).json({ success: true, data: stock });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/stocks/:id
// @desc    Update a stock (admin only)
// @access  Private/Admin
router.put('/:id', protect, isAdmin, async (req, res) => {
    try {
        const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!stock) {
            return res.status(404).json({ success: false, message: 'Stock not found' });
        }
        res.json({ success: true, data: stock });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/stocks/:id
// @desc    Soft delete a stock (admin only)
// @access  Private/Admin
router.delete('/:id', protect, isAdmin, async (req, res) => {
    try {
        const stock = await Stock.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!stock) {
            return res.status(404).json({ success: false, message: 'Stock not found' });
        }
        res.json({ success: true, message: 'Stock deactivated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/stocks/simulate
// @desc    Simulate price changes for all stocks (admin only)
// @access  Private/Admin
router.post('/simulate', protect, isAdmin, async (req, res) => {
    try {
        const stocks = await Stock.find({ isActive: true });

        for (const stock of stocks) {
            const changePercent = (Math.random() - 0.5) * 6; // -3% to +3%
            const newPrice = +(stock.price * (1 + changePercent / 100)).toFixed(2);
            const change = +(newPrice - stock.previousClose).toFixed(2);
            const newChangePercent = +((change / stock.previousClose) * 100).toFixed(2);

            const dayHigh = Math.max(stock.dayHigh, newPrice);
            const dayLow = stock.dayLow === 0 ? newPrice : Math.min(stock.dayLow, newPrice);

            // Add to historical data
            stock.historicalData.push({
                date: new Date(),
                open: stock.price,
                high: dayHigh,
                low: dayLow,
                close: newPrice,
                volume: Math.floor(Math.random() * 1000000) + 100000
            });

            // Keep only last 60 data points
            if (stock.historicalData.length > 60) {
                stock.historicalData = stock.historicalData.slice(-60);
            }

            stock.price = newPrice;
            stock.change = change;
            stock.changePercent = newChangePercent;
            stock.dayHigh = dayHigh;
            stock.dayLow = dayLow;
            stock.volume += Math.floor(Math.random() * 50000);
            stock.updatedAt = new Date();

            await stock.save();
        }

        res.json({ success: true, message: `Simulated price updates for ${stocks.length} stocks` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
