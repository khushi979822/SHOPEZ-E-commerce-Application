import { useState, useEffect } from 'react';
import { FiUsers, FiBox, FiPackage, FiDollarSign } from 'react-icons/fi';
import API from '../api/axios';
import Loader from '../components/Loader';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, usersRes] = await Promise.all([
                API.get('/admin/stats'),
                API.get('/admin/users')
            ]);
            setStats(statsRes.data.data);
            setUsers(usersRes.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="page-wrapper"><div className="container"><Loader /></div></div>;

    return (
        <div className="page-wrapper">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                    <div>
                        <h1 style={{ fontSize: '1.8rem' }}>Admin Dashboard</h1>
                        <p className="text-secondary" style={{ marginTop: 4, fontSize: '0.9rem' }}>Manage your e-commerce store</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon purple"><FiUsers /></div>
                        <div className="stat-info">
                            <h3>{stats?.totalUsers || 0}</h3>
                            <p>Total Users</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon cyan"><FiBox /></div>
                        <div className="stat-info">
                            <h3>{stats?.totalProducts || 0}</h3>
                            <p>Total Products</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon green"><FiPackage /></div>
                        <div className="stat-info">
                            <h3>{stats?.totalOrders || 0}</h3>
                            <p>Total Orders</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon orange"><FiDollarSign /></div>
                        <div className="stat-info">
                            <h3>₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}</h3>
                            <p>Total Revenue</p>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="admin-section">
                    <div className="admin-section-header">
                        <h2>Users ({users.length})</h2>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u._id}>
                                        <td style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{u.username}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={`badge ${u.usertype === 'admin' ? 'badge-warning' : 'badge-primary'}`}>
                                                {u.usertype}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                            {new Date(u.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="admin-section">
                    <div className="admin-section-header">
                        <h2>Recent Orders</h2>
                    </div>
                    {stats?.recentOrders?.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Product</th>
                                        <th>Status</th>
                                        <th>Qty</th>
                                        <th>Total</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders.map(order => (
                                        <tr key={order._id}>
                                            <td style={{ fontWeight: 500 }}>{order.userid?.username || 'N/A'}</td>
                                            <td style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{order.title || 'N/A'}</td>
                                            <td>
                                                <span className={`badge badge-${order.status === 'Pending' ? 'warning' : 'success'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>{order.quantity}</td>
                                            <td style={{ fontWeight: 600 }}>₹{order.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                            <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                                                {new Date(order.orderDate).toLocaleDateString('en-IN')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty-state" style={{ padding: 30 }}>
                            <p>No orders yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
