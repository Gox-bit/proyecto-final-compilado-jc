import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/auth';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

  
    const findUsername = (data) => {
        if (!data) return null;
        return data.username || data.nombre || (data.user && data.user.username) || (data.user && data.user.nombre);
    };

   
    const findUserId = (data) => {
        if (!data) return null;
        return data.userId || data.id || (data.user && data.user._id) || (data.user && data.user.id) || data._id;
    };

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        const storedUserId = localStorage.getItem('userId');
        const storedUsername = localStorage.getItem('username');

        if (token && storedUserId) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser({ 
                token: token, 
                id: storedUserId,
                username: storedUsername 
            }); 
        } else {
            localStorage.clear(); 
            setUser(null);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const data = await authService.loginUser(credentials);
            
            const userId = findUserId(data);
            const username = findUsername(data) || "Gamer"; 

            if (data.token) localStorage.setItem('jwt', data.token);
            if (userId) localStorage.setItem('userId', userId);
            if (username) localStorage.setItem('username', username); 
            
            if (data.token) api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            
            setUser({ 
                token: data.token, 
                id: userId,
                username: username 
            }); 

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
        localStorage.clear(); 
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