import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await API.get(`/products/${id}`);
            setProduct(res.data.data);
            if (res.data.data.sizes && res.data.data.sizes.length > 0) {
                setSelectedSize(res.data.data.sizes[0]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            setAdding(true);
            await API.post('/cart', {
                productid: product._id,
                title: product.title,
                description: product.description,
                mainImg: product.mainImg,
                Quantity: quantity,
                size: selectedSize,
                price: product.price,
                Discount: product.Discount
            });
            if (redirect) {
                navigate('/checkout');
            } else {
                navigate('/cart');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <div style={{ background: '#f1f3f6', minHeight: '100vh', padding: '24px' }}><div className="container" style={{ maxWidth: '1400px' }}><Loader /></div></div>;
    if (!product) return (
        <div style={{ background: '#f1f3f6', minHeight: '100vh', padding: '24px' }}><div className="container" style={{ maxWidth: '1400px' }}><div className="empty-state" style={{ background: '#fff', padding: '40px', textAlign: 'center' }}><h3>Product not found</h3><button className="btn btn-primary" onClick={() => navigate('/shop')}>Back to Shop</button></div></div></div>
    );

    return (
        <div style={{ background: '#f1f3f6', minHeight: '100vh', padding: '16px' }}>
            <div className="container" style={{ maxWidth: '1400px', background: '#fff', padding: '24px', borderRadius: '4px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }}>
                <button className="btn btn-ghost" onClick={() => navigate('/shop')} style={{ marginBottom: 24, padding: 0, color: '#878787' }}>
                    <FiArrowLeft /> Back to Store
                </button>

                <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

                    {/* Left: Images */}
                    <div style={{ width: '40%', position: 'sticky', top: '24px' }}>
                        <div style={{ border: '1px solid #f0f0f0', borderRadius: '2px', padding: '16px', display: 'flex', justifyContent: 'center', marginBottom: '16px', height: '400px' }}>
                            <img
                                src={product.mainImg}
                                alt={product.title}
                                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button
                                style={{ flex: 1, padding: '16px', background: '#ff9f00', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)' }}
                                onClick={handleAddToCart}
                                disabled={adding}
                            >
                                <FiShoppingCart /> {adding ? 'ADDING...' : 'ADD TO CART'}
                            </button>
                            <button
                                style={{ flex: 1, padding: '16px', background: '#fb641b', color: '#fff', border: 'none', borderRadius: '2px', fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)' }}
                                onClick={() => { handleAddToCart(); setTimeout(() => navigate('/checkout'), 500); }}
                                disabled={adding}
                            >
                                BUY NOW
                            </button>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <div style={{ color: '#878787', fontSize: '0.9rem', marginBottom: '8px' }}>Home / {product.Category} / {product.title}</div>
                            <h1 style={{ fontSize: '1.4rem', fontWeight: 400, color: '#212121', marginBottom: '8px', lineHeight: 1.4 }}>{product.title}</h1>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '8px' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 600, color: '#212121' }}>
                                ₹{product.price.toLocaleString('en-IN')}
                            </div>
                            {product.Discount > 0 && (
                                <>
                                    <div style={{ fontSize: '1.1rem', color: '#878787', textDecoration: 'line-through' }}>
                                        ₹{Math.round(product.price / (1 - product.Discount / 100)).toLocaleString('en-IN')}
                                    </div>
                                    <div style={{ fontSize: '1.1rem', color: '#388e3c', fontWeight: 600 }}>
                                        {product.Discount}% off
                                    </div>
                                </>
                            )}
                        </div>

                        {product.sizes && product.sizes.length > 0 && (
                            <div style={{ marginTop: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ color: '#878787', fontSize: '0.95rem', fontWeight: 600 }}>Size</span>
                                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                        {product.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '2px',
                                                    border: selectedSize === size ? '2px solid #2874f0' : '1px solid #e0e0e0',
                                                    background: '#fff',
                                                    color: selectedSize === size ? '#2874f0' : '#212121',
                                                    cursor: 'pointer',
                                                    fontWeight: 600,
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '8px' }}>
                            <span style={{ color: '#878787', fontSize: '0.95rem', fontWeight: 600 }}>Quantity</span>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <button style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }} onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <span style={{ padding: '0 16px', fontWeight: 600 }}>{quantity}</span>
                                <button style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid #e0e0e0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }} onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                        </div>

                        <div style={{ border: '1px solid #f0f0f0', padding: '24px', marginTop: '24px', borderRadius: '2px' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px', color: '#212121' }}>Product Description</h3>
                            <p style={{ color: '#212121', fontSize: '0.95rem', lineHeight: 1.6 }}>{product.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
