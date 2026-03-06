import { useState, useEffect } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await API.get('/products');
            setProducts(res.data.data);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ background: '#f1f3f6', minHeight: '100vh', padding: '24px' }}><div className="container" style={{ maxWidth: '1400px' }}><Loader /></div></div>;

    return (
        <div style={{ background: '#f1f3f6', minHeight: '100vh', padding: '16px' }}>
            <div className="container" style={{ maxWidth: '1400px', display: 'flex', gap: '16px', padding: 0 }}>
                {/* Filters Sidebar */}
                <div style={{ width: '280px', background: '#fff', borderRadius: '4px', padding: '16px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)', flexShrink: 0, alignSelf: 'flex-start' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>Filters</h2>

                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', color: '#878787', marginBottom: '12px' }}>Categories</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.95rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" /> Electronics</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" /> Fashion</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" /> Footwear</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" /> Home & Furniture</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}><input type="checkbox" /> Beauty</label>
                        </div>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', color: '#878787', marginBottom: '12px' }}>Price</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <select style={{ padding: '6px', border: '1px solid #e0e0e0', borderRadius: '2px', outline: 'none', flex: 1 }}><option>Min</option><option>₹500</option></select>
                            <span style={{ color: '#878787' }}>to</span>
                            <select style={{ padding: '6px', border: '1px solid #e0e0e0', borderRadius: '2px', outline: 'none', flex: 1 }}><option>Max</option><option>₹5000</option></select>
                        </div>
                    </div>
                </div>

                {/* Main Product Area */}
                <div style={{ flex: 1, background: '#fff', borderRadius: '4px', padding: '24px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }}>
                    <div style={{ marginBottom: '24px', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
                        <h1 style={{ fontSize: '1.4rem', fontWeight: 600 }}>All Products <span style={{ fontSize: '0.9rem', fontWeight: 400, color: '#878787' }}>({products.length} items)</span></h1>
                    </div>

                    {products.length === 0 ? (
                        <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
                            <h3 style={{ marginBottom: '16px', color: '#878787' }}>No products match your criteria</h3>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                            gap: '16px',
                        }}>
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
