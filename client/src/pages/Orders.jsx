import { useState, useEffect } from 'react';
import { FiPackage, FiShoppingBag } from 'react-icons/fi';
import API from '../api/axios';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await API.get('/orders');
            setOrders(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="page-wrapper"><div className="container"><Loader /></div></div>;

    return (
        <div style={{ background: '#f1f3f6', minHeight: '100vh', padding: '24px 0' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <div style={{ background: '#fff', padding: '16px 24px', borderRadius: '4px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FiPackage color="#2874f0" size={24} />
                    <h1 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>My Orders ({orders.length})</h1>
                </div>

                {orders.length === 0 ? (
                    <div style={{ background: '#fff', padding: '40px 24px', borderRadius: '4px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)', textAlign: 'center' }}>
                        <FiShoppingBag size={64} style={{ color: '#878787', marginBottom: '20px' }} />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 400, marginBottom: '16px', color: '#212121' }}>You haven't placed any orders yet!</h3>
                        <p style={{ color: '#878787', marginBottom: '24px', fontSize: '0.9rem' }}>Discover top-quality items and place your first order today.</p>
                        <button style={{ background: '#2874f0', color: '#fff', padding: '12px 48px', border: 'none', borderRadius: '2px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }} onClick={() => navigate('/shop')}>Start Shopping</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {orders.map((order) => (
                            <div key={order._id} style={{ background: '#fff', padding: '24px', borderRadius: '4px', border: '1px solid #f0f0f0', display: 'grid', gridTemplateColumns: '80px 1fr 150px 150px', gap: '24px', alignItems: 'center' }}>
                                <div style={{ width: '80px', height: '80px', border: '1px solid #f0f0f0', borderRadius: '2px', padding: '4px' }}>
                                    <img src={order.mainImg} alt={order.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 400, color: '#212121', marginBottom: '8px' }}>{order.Title}</h4>
                                    <p style={{ fontSize: '0.85rem', color: '#878787' }}>Size: {order.Size || 'Standard'} | Qty: {order.Quantity}</p>
                                </div>
                                <div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#212121' }}>₹{order.Price.toLocaleString('en-IN')}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#878787', marginTop: '4px' }}>via {order.PaymentMethod || 'Credit Card'}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginBottom: '4px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: order.Status === 'Pending' ? '#ff9f00' : '#388e3c' }}></div>
                                        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#212121' }}>{order.Status === 'Pending' ? 'Processing' : 'Delivered'}</span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#878787' }}>
                                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
