import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('shopez_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    const loadUser = async () => {
        try {
            const res = await API.get('/auth/me');
            setUser(res.data.user);
        } catch {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await API.post('/auth/login', { email, password });
        const { token: jwt, user: userData } = res.data;
        localStorage.setItem('shopez_token', jwt);
        localStorage.setItem('shopez_user', JSON.stringify(userData));
        setToken(jwt);
        setUser(userData);
        return userData;
    };

    const register = async (Username, email, password) => {
        const res = await API.post('/auth/register', { Username, email, password });
        const { token: jwt, user: userData } = res.data;
        localStorage.setItem('shopez_token', jwt);
        localStorage.setItem('shopez_user', JSON.stringify(userData));
        setToken(jwt);
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('shopez_token');
        localStorage.removeItem('shopez_user');
        setToken(null);
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const res = await API.get('/auth/me');
            setUser(res.data.user);
        } catch {
            // ignore
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}
