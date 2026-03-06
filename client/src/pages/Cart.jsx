import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import API from '../api/axios';
import Loader from '../components/Loader';

export default function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await API.get('/cart');
            setCartItems(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (id) => {
        try {
            await API.delete(`/cart/${id}`);
            setCartItems(cartItems.filter(item => item._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const emptyCart = async () => {
        try {
            await API.delete('/cart');
            setCartItems([]);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div style={{ background: '#f1f3f6', minHeight: '100vh', padding: '24px' }}><div className="container" style={{ maxWidth: '1400px' }}><Loader /></div></div>;

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.Quantity), 0);
    const shipping = subtotal > 0 && subtotal < 500 ? 50 : 0;
    const total = subtotal + shipping;

    return (
        <div style={{ background: '#f1f3f6', minHeight: '100vh', padding: '24px 0' }}>
            <div className="container" style={{ maxWidth: '1200px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: cartItems.length > 0 ? '1fr 350px' : '1fr', gap: '24px', alignItems: 'start' }}>
                    
                    {/* Left Hand Side: Cart Items or Empty State */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        
                        {/* Header Box */}
                        <div style={{ background: '#fff', padding: '16px 24px', borderRadius: '4px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h1 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>Flipkart ({cartItems.length})</h1>
                            {cartItems.length > 0 && (
                                <button style={{ background: 'none', border: 'none', color: '#2874f0', fontWeight: 600, cursor: 'pointer' }} onClick={emptyCart}>
                                    Empty Cart
                                </button>
                            )}
                        </div>

                        {cartItems.length === 0 ? (
                            <div style={{ background: '#fff', padding: '40px 24px', borderRadius: '4px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)', textAlign: 'center' }}>
                                <img src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" style={{ width: '250px', marginBottom: '24px' }} />
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 400, marginBottom: '16px', color: '#212121' }}>Your cart is empty!</h3>
                                <p style={{ color: '#878787', marginBottom: '24px', fontSize: '0.9rem' }}>Add items to it now.</p>
                                <button style={{ background: '#fb641b', color: '#fff', padding: '12px 48px', border: 'none', borderRadius: '2px', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.2)' }} onClick={() => navigate('/shop')}>Shop Now</button>
                            </div>
                        ) : (
                            <div style={{ background: '#fff', borderRadius: '4px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }}>
                                {cartItems.map((item, index) => (
                                    <div key={item._id} style={{ display: 'flex', gap: '24px', padding: '24px', borderBottom: index < cartItems.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                                        <div style={{ width: '120px', height: '120px', flexShrink: 0, border: '1px solid #f0f0f0', borderRadius: '2px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <img src={item.mainImg} alt={item.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 400, color: '#212121', marginBottom: '8px' }}>{item.title}</h3>
                                            <p style={{ fontSize: '0.9rem', color: '#878787', marginBottom: '16px' }}>Size: {item.size || 'Standard'}</p>
                                            
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
                                                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#212121' }}>₹{item.price.toLocaleString('en-IN')}</span>
                                                {item.Discount > 0 && (
                                                    <span style={{ fontSize: '0.9rem', color: '#388e3c', fontWeight: 600 }}>{item.Discount}% Off</span>
                                                )}
                                            </div>
                                            
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: 'auto' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <span style={{ fontWeight: 600, color: '#212121' }}>Qty: {item.Quantity}</span>
                                                </div>
                                                <button style={{ background: 'none', border: 'none', color: '#212121', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => removeItem(item._id)}>
                                                    REMOVE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Place Order Footer inside the cart items container like Flipkart */}
                                <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', background: '#fff', borderRadius: '0 0 4px 4px', boxShadow: '0 -2px 10px 0 rgba(0,0,0,.05)', position: 'sticky', bottom: 0, zIndex: 10 }}>
                                    <button
                                        style={{ background: '#fb641b', color: '#fff', padding: '16px 48px', border: 'none', borderRadius: '2px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)' }}
                                        onClick={() => navigate('/checkout')}
                                    >
                                        PLACE ORDER
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Hand Side: Price Details */}
                    {cartItems.length > 0 && (
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
                                    <span style={{ color: shipping === 0 ? '#388e3c' : '#212121' }}>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderTop: '1px dashed #e0e0e0', borderBottom: '1px dashed #e0e0e0', marginBottom: '20px', fontSize: '1.2rem', fontWeight: 600, color: '#212121' }}>
                                    <span>Total Amount</span>
                                    <span>₹{total.toLocaleString('en-IN')}</span>
                                </div>
                                
                                <div style={{ color: '#388e3c', fontWeight: 600, fontSize: '0.95rem' }}>
                                    You will save ₹0 on this order
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
