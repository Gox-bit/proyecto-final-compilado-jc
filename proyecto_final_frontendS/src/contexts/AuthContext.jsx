import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/auth';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser({ token: token }); 
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const data = await authService.loginUser(credentials);
            localStorage.setItem('jwt', data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            setUser({ token: data.token, id: data.userId }); 
            return data;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const data = await authService.registerUser(userData);
            return data;
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('jwt');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);