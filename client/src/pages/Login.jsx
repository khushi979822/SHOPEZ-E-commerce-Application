import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const userData = await login(form.email, form.password);
            navigate(userData.UserType === 'admin' ? '/admin' : '/shop');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#f1f3f6', minHeight: 'calc(100vh - 116px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
            <div style={{ display: 'flex', background: '#fff', width: '100%', maxWidth: '800px', borderRadius: '4px', boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)', overflow: 'hidden', minHeight: '500px' }}>
                
                {/* Left Side Branding */}
                <div style={{ width: '40%', background: '#2874f0', padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '16px' }}>Login</h1>
                        <p style={{ fontSize: '1.1rem', color: '#e0e0e0', lineHeight: 1.5 }}>Get access to your Orders, Wishlist and Recommendations</p>
                    </div>
                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" alt="Login Banner" style={{ width: '100%', objectFit: 'contain' }} />
                </div>

                {/* Right Side Form */}
                <div style={{ flex: 1, padding: '40px 32px', display: 'flex', flexDirection: 'column' }}>
                    
                    {error && <div style={{ background: '#ffeef0', color: '#ff6161', padding: '12px', borderRadius: '2px', fontSize: '0.9rem', marginBottom: '24px' }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ flex: 1 }}>
                        <div style={{ marginBottom: '24px' }}>
                            <input
                                id="login-email"
                                type="email"
                                placeholder="Enter Email Address"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                                style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid #e0e0e0', outline: 'none', fontSize: '1rem', color: '#212121', background: 'transparent' }}
                                onFocus={(e) => e.target.style.borderBottom = '1px solid #2874f0'}
                                onBlur={(e) => e.target.style.borderBottom = '1px solid #e0e0e0'}
                            />
                        </div>
                        <div style={{ marginBottom: '32px' }}>
                            <input
                                id="login-password"
                                type="password"
                                placeholder="Enter Password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                                style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid #e0e0e0', outline: 'none', fontSize: '1rem', color: '#212121', background: 'transparent' }}
                                onFocus={(e) => e.target.style.borderBottom = '1px solid #2874f0'}
                                onBlur={(e) => e.target.style.borderBottom = '1px solid #e0e0e0'}
                            />
                        </div>
                        
                        <p style={{ fontSize: '0.75rem', color: '#878787', marginBottom: '24px' }}>
                            By continuing, you agree to ShopEZ's Terms of Use and Privacy Policy.
                        </p>

                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            style={{ width: '100%', background: '#fb641b', color: '#fff', border: 'none', padding: '14px', borderRadius: '2px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)' }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                        <Link to="/register" style={{ color: '#2874f0', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>New to ShopEZ? Create an account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
