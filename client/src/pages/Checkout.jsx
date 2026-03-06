import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Loader from '../components/Loader';

export default function Checkout() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    // Form fields
    const [formData, setFormData] = useState({
        name: '',
        Mobile: '',
        Email: '',
        Address: '',
        Pincode: '',
        PaymentMethod: 'Credit Card'
    });

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await API.get('/cart');
            if (res.data.data.length === 0) {
                navigate('/cart');
            }
            setCartItems(res.data.data);

            // prefill email if user is logged in
            const me = await API.get('/auth/me');
            if (me.data.user) {
                setFormData(prev => ({ ...prev, Email: me.data.user.email, name: me.data.user.Username }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleCheckout = async (e) => {
        e.preventDefault();
        setPlacingOrder(true);
        try {
            // For simplicity, create an order for each cart item
            for (const item of cartItems) {
                await API.post('/orders', {
                    ...formData,
                    Title: item.title,
                    Desc: item.description,
                    Image: item.mainImg,
                    Size: item.size,
                    Quantity: item.Quantity,
                    Price: item.price,
                    Discount: item.Discount
                });
            }
            // Empty cart
            await API.delete('/cart');

            alert('Order placed successfully!');
            navigate('/orders');
        } catch (err) {
            console.error(err);
            alert('Checkout failed: ' + err.response?.data?.message);
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) return <div className="page-wrapper"><div className="container"><Loader /></div></div>;

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.Quantity), 0);
    const total = subtotal + (subtotal < 500 ? 50 : 0);

    return (
        <div style={{ background: '#f1f3f6', minHeight: '100vh', padding: '24px 0' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                
                <form onSubmit={handleCheckout} style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
                    
                    {/* Left Side: Delivery Address Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        
                        <div style={{ background: '#fff', padding: '24px', borderRadius: '4px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2874f0', textTransform: 'uppercase', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ background: '#f1f3f6', color: '#2874f0', padding: '2px 8px', borderRadius: '2px', fontSize: '0.8rem' }}>1</span>
                                Delivery Address
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div className="form-group">
                                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '2px' }} />
                                </div>
                                <div className="form-group">
                                    <input type="text" name="Mobile" placeholder="10-digit mobile number" value={formData.Mobile} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '2px' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                <div className="form-group">
                                    <input type="email" name="Email" placeholder="Email (for order updates)" value={formData.Email} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '2px' }} />
                                </div>
                                <div className="form-group">
                                    <input type="text" name="Pincode" placeholder="Pincode" value={formData.Pincode} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '2px' }} />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <textarea name="Address" placeholder="Address (Area and Street)" value={formData.Address} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '2px', minHeight: '100px' }}></textarea>
                            </div>
                        </div>

                        <div style={{ background: '#fff', padding: '24px', borderRadius: '4px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#2874f0', textTransform: 'uppercase', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ background: '#f1f3f6', color: '#2874f0', padding: '2px 8px', borderRadius: '2px', fontSize: '0.8rem' }}>2</span>
                                Payment Options
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'COD'].map((method) => (
                                    <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '4px', cursor: 'pointer', background: formData.PaymentMethod === method ? '#f5faff' : '#fff' }}>
                                        <input 
                                            type="radio" 
                                            name="PaymentMethod" 
                                            value={method} 
                                            checked={formData.PaymentMethod === method} 
                                            onChange={handleChange}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <span style={{ fontSize: '0.95rem', color: '#212121' }}>{method}</span>
                                    </label>
                                ))}
                            </div>
                            
                            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                                <button
                                    type="submit"
                                    style={{ background: '#fb641b', color: '#fff', padding: '16px 48px', border: 'none', borderRadius: '2px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)' }}
                                    disabled={placingOrder}
                                >
                                    {placingOrder ? 'PROCESSING...' : 'CONFIRM ORDER'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Price Details Summary */}
                    <div style={{ background: '#fff', borderRadius: '4px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)', position: 'sticky', top: '24px' }}>
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#878787', textTransform: 'uppercase', margin: 0 }}>Price Details</h3>
                        </div>
                        
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1rem', color: '#212121' }}>
                                <span>Price ({cartItems.length} items)</span>
                                <span>₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1rem', color: '#212121' }}>
                                <span>Delivery Charges</span>
                                <span style={{ color: subtotal >= 500 ? '#388e3c' : '#212121' }}>{subtotal >= 500 ? 'FREE' : '₹50'}</span>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderTop: '1px dashed #e0e0e0', borderBottom: '1px dashed #e0e0e0', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 600, color: '#212121' }}>
                                <span>Total Amount</span>
                                <span>₹{total.toLocaleString('en-IN')}</span>
                            </div>
                            
                            <div style={{ color: '#388e3c', fontWeight: 600, fontSize: '0.95rem' }}>
                                Safe and Secure Payments. Easy returns.
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
