const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');
const { protect } = require('../middleware/auth');

// @route   GET /api/portfolio
// @desc    Get user's portfolio with real-time P&L
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId: req.user._id })
            .populate('holdings.stockId', 'symbol name price change changePercent sector');

        if (!portfolio) {
            return res.json({
                success: true,
                data: {
                    holdings: [],
                    totalInvested: 0,
                    currentValue: 0,
                    totalPnL: 0,
                    totalPnLPercent: 0
                }
            });
        }

        let currentValue = 0;
        const holdings = portfolio.holdings
            .filter(h => h.stockId) // filter out deleted stocks
            .map(h => {
                const currentPrice = h.stockId.price;
                const investedValue = +(h.avgBuyPrice * h.quantity).toFixed(2);
                const marketValue = +(currentPrice * h.quantity).toFixed(2);
                const pnl = +(marketValue - investedValue).toFixed(2);
                const pnlPercent = investedValue > 0 ? +((pnl / investedValue) * 100).toFixed(2) : 0;

                currentValue += marketValue;

                return {
                    stockId: h.stockId._id,
                    symbol: h.stockId.symbol,
                    name: h.stockId.name,
                    sector: h.stockId.sector,
                    quantity: h.quantity,
                    avgBuyPrice: h.avgBuyPrice,
                    currentPrice,
                    change: h.stockId.change,
                    changePercent: h.stockId.changePercent,
                    investedValue,
                    marketValue,
                    pnl,
                    pnlPercent
                };
            });

        currentValue = +currentValue.toFixed(2);
        const totalPnL = +(currentValue - portfolio.totalInvested).toFixed(2);
        const totalPnLPercent = portfolio.totalInvested > 0
            ? +((totalPnL / portfolio.totalInvested) * 100).toFixed(2)
            : 0;

        res.json({
            success: true,
            data: {
                holdings,
                totalInvested: portfolio.totalInvested,
                currentValue,
                totalPnL,
                totalPnLPercent
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
