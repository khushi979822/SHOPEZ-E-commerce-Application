import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StockChart from '../components/StockChart';
import TradeModal from '../components/TradeModal';
import Loader from '../components/Loader';

export default function StockDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stock, setStock] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tradeType, setTradeType] = useState(null);

    useEffect(() => {
        fetchStock();
    }, [id]);

    const fetchStock = async () => {
        try {
            const res = await API.get(`/stocks/${id}`);
            setStock(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="page-wrapper"><div className="container"><Loader /></div></div>;
    if (!stock) return (
        <div className="page-wrapper">
            <div className="container">
                <div className="empty-state">
                    <h3>Stock not found</h3>
                    <button className="btn btn-primary" onClick={() => navigate('/stocks')}>Back to Market</button>
                </div>
            </div>
        </div>
    );

    const isUp = stock.changePercent >= 0;
    const [imgError, setImgError] = useState(false);

    // Use unavatar.io for company logos, fallback to initials if the logo isn't found
    const avatarUrl = imgError
        ? `https://ui-avatars.com/api/?name=${stock.symbol}&background=random&color=fff&bold=true`
        : `https://unavatar.io/${stock.symbol.toLowerCase()}.com?fallback=false`;

    return (
        <div className="page-wrapper">
            <div className="container">
                <button className="btn btn-ghost" onClick={() => navigate('/stocks')} style={{ marginBottom: 24 }}>
                    <FiArrowLeft /> Back to Market
                </button>

                {/* Stock Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <img
                            src={avatarUrl}
                            alt={`${stock.symbol} logo`}
                            style={{ width: 64, height: 64, borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '1px solid var(--border-glass)' }}
                            onError={() => setImgError(true)}
                        />
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <h1 style={{ fontSize: '2rem' }}>{stock.symbol}</h1>
                                <span className="badge badge-primary">{stock.sector}</span>
                            </div>
                            <p className="text-secondary" style={{ marginTop: 4 }}>{stock.name}</p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>
                            ₹{stock.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        <span className={`stock-change ${isUp ? 'up' : 'down'}`} style={{ fontSize: '0.95rem' }}>
                            {isUp ? <FiArrowUpRight /> : <FiArrowDownRight />}
                            {isUp ? '+' : ''}{stock.change?.toFixed(2)} ({isUp ? '+' : ''}{stock.changePercent?.toFixed(2)}%)
                        </span>
                    </div>
                </div>

                <div className="stock-detail-grid">
                    {/* Chart */}
                    <div className="stock-detail-chart">
                        <h3 style={{ marginBottom: 20, fontSize: '1.1rem' }}>Price History (30 Days)</h3>
                        <StockChart historicalData={stock.historicalData} symbol={stock.symbol} />
                    </div>

                    {/* Sidebar */}
                    <div className="stock-detail-sidebar">
                        {/* Trade Buttons */}
                        {user && (
                            <div className="stock-info-card">
                                <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Trade</h3>
                                <div className="trade-buttons">
                                    <button
                                        id="btn-buy-stock"
                                        className="btn btn-success btn-lg"
                                        onClick={() => setTradeType('BUY')}
                                    >
                                        Buy
                                    </button>
                                    <button
                                        id="btn-sell-stock"
                                        className="btn btn-danger btn-lg"
                                        onClick={() => setTradeType('SELL')}
                                    >
                                        Sell
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Stock Info */}
                        <div className="stock-info-card">
                            <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Stock Information</h3>
                            <div className="stock-info-row">
                                <span className="label">Previous Close</span>
                                <span className="value">₹{stock.previousClose?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="stock-info-row">
                                <span className="label">Day High</span>
                                <span className="value" style={{ color: 'var(--color-success)' }}>₹{stock.dayHigh?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="stock-info-row">
                                <span className="label">Day Low</span>
                                <span className="value" style={{ color: 'var(--color-danger)' }}>₹{stock.dayLow?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="stock-info-row">
                                <span className="label">Volume</span>
                                <span className="value">{stock.volume?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="stock-info-row">
                                <span className="label">Market Cap</span>
                                <span className="value">{stock.marketCap}</span>
                            </div>
                            <div className="stock-info-row">
                                <span className="label">Sector</span>
                                <span className="value">{stock.sector}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trade Modal */}
            {tradeType && (
                <TradeModal
                    stock={stock}
                    type={tradeType}
                    onClose={() => setTradeType(null)}
                    onSuccess={fetchStock}
                />
            )}
        </div>
    );
}
