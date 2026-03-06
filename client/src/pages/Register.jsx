import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ Username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            return setError('Passwords do not match');
        }
        if (form.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            await register(form.Username, form.email, form.password);
            navigate('/shop');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: '#f1f3f6', minHeight: 'calc(100vh - 116px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
            <div style={{ display: 'flex', background: '#fff', width: '100%', maxWidth: '800px', borderRadius: '4px', boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)', overflow: 'hidden', minHeight: '550px' }}>
                
                {/* Left Side Branding */}
                <div style={{ width: '40%', background: '#2874f0', padding: '40px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff' }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '16px' }}>Looks like you're new here!</h1>
                        <p style={{ fontSize: '1.1rem', color: '#e0e0e0', lineHeight: 1.5 }}>Sign up with your details to get started</p>
                    </div>
                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png" alt="Register Banner" style={{ width: '100%', objectFit: 'contain' }} />
                </div>

                {/* Right Side Form */}
                <div style={{ flex: 1, padding: '40px 32px', display: 'flex', flexDirection: 'column' }}>
                    
                    {error && <div style={{ background: '#ffeef0', color: '#ff6161', padding: '12px', borderRadius: '2px', fontSize: '0.9rem', marginBottom: '24px' }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ flex: 1 }}>
                        <div style={{ marginBottom: '20px' }}>
                            <input
                                id="register-username"
                                type="text"
                                placeholder="Enter Username"
                                value={form.Username}
                                onChange={(e) => setForm({ ...form, Username: e.target.value })}
                                required
                                style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid #e0e0e0', outline: 'none', fontSize: '1rem', color: '#212121', background: 'transparent' }}
                                onFocus={(e) => e.target.style.borderBottom = '1px solid #2874f0'}
                                onBlur={(e) => e.target.style.borderBottom = '1px solid #e0e0e0'}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <input
                                id="register-email"
                                type="email"
                                placeholder="Enter Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                                style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid #e0e0e0', outline: 'none', fontSize: '1rem', color: '#212121', background: 'transparent' }}
                                onFocus={(e) => e.target.style.borderBottom = '1px solid #2874f0'}
                                onBlur={(e) => e.target.style.borderBottom = '1px solid #e0e0e0'}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <input
                                id="register-password"
                                type="password"
                                placeholder="Create Password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                                style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid #e0e0e0', outline: 'none', fontSize: '1rem', color: '#212121', background: 'transparent' }}
                                onFocus={(e) => e.target.style.borderBottom = '1px solid #2874f0'}
                                onBlur={(e) => e.target.style.borderBottom = '1px solid #e0e0e0'}
                            />
                        </div>
                        <div style={{ marginBottom: '32px' }}>
                            <input
                                id="register-confirm-password"
                                type="password"
                                placeholder="Confirm Password"
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                required
                                style={{ width: '100%', padding: '12px 0', border: 'none', borderBottom: '1px solid #e0e0e0', outline: 'none', fontSize: '1rem', color: '#212121', background: 'transparent' }}
                                onFocus={(e) => e.target.style.borderBottom = '1px solid #2874f0'}
                                onBlur={(e) => e.target.style.borderBottom = '1px solid #e0e0e0'}
                            />
                        </div>

                        <button
                            id="register-submit"
                            type="submit"
                            disabled={loading}
                            style={{ width: '100%', background: '#fb641b', color: '#fff', border: 'none', padding: '14px', borderRadius: '2px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)' }}
                        >
                            {loading ? 'Creating...' : 'Continue'}
                        </button>
                    </form>

                    <button 
                        style={{ marginTop: '24px', width: '100%', background: '#fff', color: '#2874f0', border: 'none', padding: '14px', borderRadius: '2px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 4px 0 rgba(0,0,0,.1)' }}
                        onClick={() => navigate('/login')}
                    >
                        Existing User? Log in
                    </button>
                </div>
            </div>
        </div>
    );
}
