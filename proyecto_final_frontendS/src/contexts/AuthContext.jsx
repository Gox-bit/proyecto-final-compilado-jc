import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/auth';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        const storedUserId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');
        const storedRole = localStorage.getItem('role');

        if (token && storedUserId) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser({ 
                token, 
                id: storedUserId,
                username: storedUsername,
                role: storedRole
            }); 
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const data = await authService.loginUser(credentials);
            const role = data.role || 'user'; 

            localStorage.setItem('jwt', data.token);
            localStorage.setItem('userId', data._id || data.userId);
            localStorage.setItem('username', data.nombre || data.username);
            localStorage.setItem('role', role);
            
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            
            setUser({ 
                token: data.token, 
                id: data._id || data.userId, 
                username: data.nombre || data.username,
                role: role
            }); 
            return data;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.clear();
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);