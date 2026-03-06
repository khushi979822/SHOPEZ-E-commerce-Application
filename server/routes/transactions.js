const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Stock = require('../models/Stock');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const { protect } = require('../middleware/auth');

// @route   POST /api/transactions/buy
// @desc    Buy stocks
// @access  Private
router.post('/buy', protect, async (req, res) => {
    try {
        const { stockId, quantity } = req.body;

        if (!stockId || !quantity || quantity < 1) {
            return res.status(400).json({ success: false, message: 'Please provide stockId and valid quantity' });
        }

        const stock = await Stock.findById(stockId);
        if (!stock || !stock.isActive) {
            return res.status(404).json({ success: false, message: 'Stock not found or inactive' });
        }

        const totalCost = +(stock.price * quantity).toFixed(2);
        const user = await User.findById(req.user._id);

        if (user.balance < totalCost) {
            return res.status(400).json({ success: false, message: `Insufficient balance. You need ₹${totalCost} but have ₹${user.balance}` });
        }

        // Deduct balance
        user.balance = +(user.balance - totalCost).toFixed(2);
        await user.save();

        // Create transaction
        const transaction = await Transaction.create({
            userId: user._id,
            stockId: stock._id,
            type: 'BUY',
            quantity,
            priceAtExecution: stock.price,
            totalAmount: totalCost
        });

        // Update portfolio
        let portfolio = await Portfolio.findOne({ userId: user._id });
        if (!portfolio) {
            portfolio = await Portfolio.create({ userId: user._id, holdings: [], totalInvested: 0 });
        }

        const existingHolding = portfolio.holdings.find(h => h.stockId.toString() === stockId);
        if (existingHolding) {
            const totalQty = existingHolding.quantity + quantity;
            existingHolding.avgBuyPrice = +(
                (existingHolding.avgBuyPrice * existingHolding.quantity + stock.price * quantity) / totalQty
            ).toFixed(2);
            existingHolding.quantity = totalQty;
        } else {
            portfolio.holdings.push({
                stockId: stock._id,
                quantity,
                avgBuyPrice: stock.price
            });
        }

        portfolio.totalInvested = +(portfolio.totalInvested + totalCost).toFixed(2);
        portfolio.updatedAt = new Date();
        await portfolio.save();

        res.status(201).json({
            success: true,
            message: `Successfully bought ${quantity} shares of ${stock.symbol} at ₹${stock.price}`,
            data: { transaction, balance: user.balance }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/transactions/sell
// @desc    Sell stocks
// @access  Private
router.post('/sell', protect, async (req, res) => {
    try {
        const { stockId, quantity } = req.body;

        if (!stockId || !quantity || quantity < 1) {
            return res.status(400).json({ success: false, message: 'Please provide stockId and valid quantity' });
        }

        const stock = await Stock.findById(stockId);
        if (!stock) {
            return res.status(404).json({ success: false, message: 'Stock not found' });
        }

        const portfolio = await Portfolio.findOne({ userId: req.user._id });
        if (!portfolio) {
            return res.status(400).json({ success: false, message: 'No portfolio found' });
        }

        const holding = portfolio.holdings.find(h => h.stockId.toString() === stockId);
        if (!holding || holding.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: `Insufficient shares. You own ${holding ? holding.quantity : 0} shares of ${stock.symbol}`
            });
        }

        const totalRevenue = +(stock.price * quantity).toFixed(2);

        // Credit balance
        const user = await User.findById(req.user._id);
        user.balance = +(user.balance + totalRevenue).toFixed(2);
        await user.save();

        // Create transaction
        const transaction = await Transaction.create({
            userId: user._id,
            stockId: stock._id,
            type: 'SELL',
            quantity,
            priceAtExecution: stock.price,
            totalAmount: totalRevenue
        });

        // Update portfolio
        holding.quantity -= quantity;
        if (holding.quantity === 0) {
            portfolio.holdings = portfolio.holdings.filter(h => h.stockId.toString() !== stockId);
        }

        const soldInvestment = +(holding.avgBuyPrice * quantity).toFixed(2);
        portfolio.totalInvested = Math.max(0, +(portfolio.totalInvested - soldInvestment).toFixed(2));
        portfolio.updatedAt = new Date();
        await portfolio.save();

        res.status(201).json({
            success: true,
            message: `Successfully sold ${quantity} shares of ${stock.symbol} at ₹${stock.price}`,
            data: { transaction, balance: user.balance }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/transactions
// @desc    Get user's transaction history
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id })
            .populate('stockId', 'symbol name price')
            .sort({ timestamp: -1 })
            .limit(50);

        res.json({ success: true, data: transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
