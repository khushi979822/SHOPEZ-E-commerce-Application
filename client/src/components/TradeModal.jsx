import { useState } from 'react';
import { FiX, FiMinus, FiPlus } from 'react-icons/fi';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function TradeModal({ stock, type, onClose, onSuccess }) {
    const { user, refreshUser } = useAuth();
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const totalAmount = +(stock.price * quantity).toFixed(2);
    const isBuy = type === 'BUY';

    const handleTrade = async () => {
        setError('');
        setLoading(true);
        try {
            const endpoint = isBuy ? '/transactions/buy' : '/transactions/sell';
            await API.post(endpoint, { stockId: stock._id, quantity });
            await refreshUser();
            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Transaction failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isBuy ? '🟢 Buy' : '🔴 Sell'} {stock.symbol}</h2>
                    <button className="modal-close" onClick={onClose}><FiX /></button>
                </div>

                {error && <div className="form-error">{error}</div>}

                <div style={{ marginBottom: 20, padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span className="text-secondary">Current Price</span>
                        <span style={{ fontWeight: 700 }}>₹{stock.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="text-secondary">Available Balance</span>
                        <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>₹{user?.balance?.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Quantity</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button
                            className="btn btn-ghost"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            style={{ width: 40, height: 40, padding: 0 }}
                        >
                            <FiMinus />
                        </button>
                        <input
                            type="number"
                            className="form-input"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            min="1"
                            style={{ textAlign: 'center', maxWidth: 100 }}
                        />
                        <button
                            className="btn btn-ghost"
                            onClick={() => setQuantity(quantity + 1)}
                            style={{ width: 40, height: 40, padding: 0 }}
                        >
                            <FiPlus />
                        </button>
                    </div>
                </div>

                <div style={{
                    padding: '16px',
                    background: isBuy ? 'rgba(16, 185, 129, 0.06)' : 'rgba(239, 68, 68, 0.06)',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isBuy ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`,
                    marginBottom: 24
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Amount</span>
                        <span style={{ fontSize: '1.4rem', fontWeight: 800, color: isBuy ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>

                <button
                    className={`btn ${isBuy ? 'btn-success' : 'btn-danger'} btn-lg`}
                    style={{ width: '100%' }}
                    onClick={handleTrade}
                    disabled={loading || (isBuy && totalAmount > user?.balance)}
                >
                    {loading ? 'Processing...' : `${isBuy ? 'Buy' : 'Sell'} ${quantity} share${quantity > 1 ? 's' : ''}`}
                </button>
            </div>
        </div>
    );
}
