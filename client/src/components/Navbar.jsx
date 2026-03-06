import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiShoppingBag, FiLogOut, FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar" style={{ background: 'var(--accent-primary)', borderBottom: 'none', padding: 0 }}>
            {/* Main Header */}
            <div className="navbar-inner" style={{ height: '60px', padding: '0 24px' }}>
                <Link to="/" className="navbar-logo" style={{ color: '#fff' }}>
                    <FiShoppingBag style={{ color: '#fb641b', marginRight: '6px' }} />
                    <span style={{ fontWeight: 700, fontStyle: 'italic', letterSpacing: '-0.5px' }}>ShopEZ</span>
                </Link>

                <div className="navbar-search" style={{ flex: 1, maxWidth: '600px', margin: '0 40px', display: 'flex' }}>
                    <input
                        type="text"
                        placeholder="Search for products, brands and more"
                        style={{ width: '100%', padding: '8px 16px', borderRadius: '4px 0 0 4px', border: 'none', outline: 'none', fontSize: '0.95rem' }}
                    />
                    <button style={{ padding: '0 20px', background: '#fb541b', color: '#fff', border: 'none', borderRadius: '0 4px 4px 0', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <FiSearch size={20} />
                    </button>
                </div>

                <div className="navbar-right" style={{ gap: '24px' }}>
                    {user ? (
                        <>
                            <div className="navbar-user" style={{ background: 'transparent', color: '#fff', fontWeight: 600 }}>
                                <FiUser size={18} />
                                {user.Username}
                            </div>
                            <Link to="/orders" className="navbar-link" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>Orders</Link>
                            <Link to="/cart" className="navbar-link" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FiShoppingCart size={18} /> Cart
                            </Link>
                            {user.UserType === 'admin' && (
                                <Link to="/admin" className="navbar-link" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none' }}>Admin</Link>
                            )}
                            <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ color: '#fff' }}>
                                <FiLogOut />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn" style={{ background: '#fff', color: 'var(--accent-primary)', padding: '6px 28px', fontWeight: 600 }}>Login</Link>
                            <Link to="/cart" className="navbar-link" style={{ color: '#fff', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FiShoppingCart size={18} /> Cart
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Sub Navbar / Categories */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }}>
                <div className="container" style={{ maxWidth: '1280px', display: 'flex', alignItems: 'center', gap: '32px', height: '40px', padding: '0 24px', fontSize: '0.9rem', fontWeight: 600, color: '#212121' }}>
                    <Link to="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>All Products</Link>
                    <Link to="/shop?category=Electronics" style={{ color: 'inherit', textDecoration: 'none' }}>Electronics</Link>
                    <Link to="/shop?category=Fashion" style={{ color: 'inherit', textDecoration: 'none' }}>Fashion</Link>
                    <Link to="/shop?category=Footwear" style={{ color: 'inherit', textDecoration: 'none' }}>Footwear</Link>
                    <Link to="/shop?category=Home%20%26%20Furniture" style={{ color: 'inherit', textDecoration: 'none' }}>Home & Furniture</Link>
                    <Link to="/shop?category=Beauty" style={{ color: 'inherit', textDecoration: 'none' }}>Beauty</Link>
                </div>
            </div>
        </nav>
    );
}
