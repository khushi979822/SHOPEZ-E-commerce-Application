import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiStar, FiTruck, FiShield, FiTag } from 'react-icons/fi';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [banner, setBanner] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await API.get('/admin/config');
            if (res.data.data) {
                setBanner(res.data.data.Banner);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await API.get('/products');
            setFeaturedProducts(res.data.data.slice(0, 4)); // Show first 4 as featured
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Hero / Banner Area */}
            <section style={{ padding: '16px', background: '#f1f3f6' }}>
                <div className="container" style={{ maxWidth: '1400px', padding: 0 }}>
                    <div style={{ background: '#fff', borderRadius: '4px', display: 'flex', overflow: 'hidden', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }}>
                        <div style={{ flex: 1, padding: '40px 60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h1 style={{ fontSize: '2.5rem', color: '#212121', marginBottom: '16px', fontWeight: 600 }}>Big Billion Days Sale!</h1>
                            <p style={{ fontSize: '1.2rem', color: '#878787', marginBottom: '24px' }}>Up to 80% off on premium electronics and fashion.</p>
                            <Link to="/shop" style={{ background: '#2874f0', color: '#fff', padding: '12px 32px', borderRadius: '2px', fontSize: '1rem', fontWeight: 600, alignSelf: 'flex-start', boxShadow: '0 2px 4px 0 rgba(0,0,0,.2)' }}>Shop Now</Link>
                        </div>
                        <div style={{ flex: 1, background: 'linear-gradient(45deg, #f3e5f5, #e1bee7)' }}>
                            <img src={banner || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80"} alt="Sale Promo" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products / Deal of the Day */}
            <section style={{ padding: '16px', background: '#f1f3f6', minHeight: '50vh' }}>
                <div className="container" style={{ maxWidth: '1400px', padding: 0 }}>
                    <div style={{ background: '#fff', borderRadius: '4px', padding: '24px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e0e0e0', paddingBottom: '16px' }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#212121' }}>Deals of the Day</h2>
                            <Link to="/shop" style={{ background: '#2874f0', color: '#fff', padding: '8px 20px', borderRadius: '2px', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none' }}>VIEW ALL</Link>
                        </div>

                        {loading ? (
                            <Loader />
                        ) : (
                            <div className="stocks-grid" style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                                gap: '16px',
                                marginBottom: '24px'
                            }}>
                                {featuredProducts.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer pre-area or other sections can go here */}
        </>
    );
}
