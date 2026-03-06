import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiBriefcase } from 'react-icons/fi';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PortfolioChart from '../components/PortfolioChart';
import Loader from '../components/Loader';

export default function Portfolio() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [portfolio, setPortfolio] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [portRes, txRes] = await Promise.all([
                API.get('/portfolio'),
                API.get('/transactions')
            ]);
            setPortfolio(portRes.data.data);
            setTransactions(txRes.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="page-wrapper"><div className="container"><Loader /></div></div>;

    const pData = portfolio || { holdings: [], totalInvested: 0, currentValue: 0, totalPnL: 0, totalPnLPercent: 0 };

    return (
        <div className="page-wrapper">
            <div className="container">
                <h1 style={{ fontSize: '1.8rem', marginBottom: 24 }}>My Portfolio</h1>

                {/* Summary Cards */}
                <div className="portfolio-summary">
                    <div className="portfolio-summary-card">
                        <h4><FiDollarSign style={{ marginRight: 4, verticalAlign: 'middle' }} /> Balance</h4>
                        <div className="value" style={{ color: 'var(--color-success)' }}>
                            ₹{user?.balance?.toLocaleString('en-IN')}
                        </div>
                    </div>
                    <div className="portfolio-summary-card">
                        <h4><FiBriefcase style={{ marginRight: 4, verticalAlign: 'middle' }} /> Invested</h4>
                        <div className="value">
                            ₹{pData.totalInvested?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                    <div className="portfolio-summary-card">
                        <h4>Current Value</h4>
                        <div className="value" style={{ color: 'var(--accent-cyan)' }}>
                            ₹{pData.currentValue?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                    <div className="portfolio-summary-card">
                        <h4>{pData.totalPnL >= 0 ? <FiTrendingUp style={{ marginRight: 4, verticalAlign: 'middle' }} /> : <FiTrendingDown style={{ marginRight: 4, verticalAlign: 'middle' }} />} P&L</h4>
                        <div className="value" style={{ color: pData.totalPnL >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            {pData.totalPnL >= 0 ? '+' : ''}₹{pData.totalPnL?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            <span style={{ fontSize: '0.85rem', marginLeft: 6 }}>
                                ({pData.totalPnLPercent >= 0 ? '+' : ''}{pData.totalPnLPercent?.toFixed(2)}%)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Holdings & Chart */}
                {pData.holdings.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, marginBottom: 32 }}>
                        <div className="portfolio-holdings">
                            <h3 style={{ marginBottom: 20, fontSize: '1.1rem' }}>Holdings ({pData.holdings.length})</h3>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Stock</th>
                                        <th>Qty</th>
                                        <th>Avg Price</th>
                                        <th>Current</th>
                                        <th>P&L</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pData.holdings.map((h) => (
                                        <tr key={h.stockId}>
                                            <td>
                                                <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{h.symbol}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.name}</div>
                                            </td>
                                            <td style={{ fontWeight: 600 }}>{h.quantity}</td>
                                            <td>₹{h.avgBuyPrice?.toFixed(2)}</td>
                                            <td>₹{h.currentPrice?.toFixed(2)}</td>
                                            <td>
                                                <span style={{ color: h.pnl >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
                                                    {h.pnl >= 0 ? '+' : ''}₹{h.pnl?.toFixed(2)}
                                                </span>
                                                <div style={{ fontSize: '0.72rem', color: h.pnlPercent >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                                    {h.pnlPercent >= 0 ? '+' : ''}{h.pnlPercent?.toFixed(2)}%
                                                </div>
                                            </td>
                                            <td>
                                                <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/stocks/${h.stockId}`)}>View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="glass-card" style={{ padding: 24, height: 'fit-content' }}>
                            <h3 style={{ marginBottom: 20, fontSize: '1.1rem', textAlign: 'center' }}>Allocation</h3>
                            <PortfolioChart holdings={pData.holdings} />
                        </div>
                    </div>
                ) : (
                    <div className="empty-state glass-card" style={{ marginBottom: 32 }}>
                        <div className="icon">📈</div>
                        <h3>No Holdings Yet</h3>
                        <p>Start building your portfolio by buying stocks from the market.</p>
                        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/stocks')}>
                            Browse Market
                        </button>
                    </div>
                )}

                {/* Transaction History */}
                <div className="portfolio-holdings">
                    <h3 style={{ marginBottom: 20, fontSize: '1.1rem' }}>Transaction History</h3>
                    {transactions.length === 0 ? (
                        <div className="empty-state" style={{ padding: 40 }}>
                            <p>No transactions yet</p>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Stock</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx._id}>
                                        <td>
                                            <span className={`badge ${tx.type === 'BUY' ? 'badge-success' : 'badge-danger'}`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: 600, color: 'var(--text-heading)' }}>
                                            {tx.stockId?.symbol || 'N/A'}
                                        </td>
                                        <td>{tx.quantity}</td>
                                        <td>₹{tx.priceAtExecution?.toFixed(2)}</td>
                                        <td style={{ fontWeight: 600 }}>₹{tx.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                            {new Date(tx.timestamp).toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
