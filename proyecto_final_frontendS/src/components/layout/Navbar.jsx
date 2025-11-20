import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">GameHub</Link>
                <div className="space-x-4">
                    <Link to="/" className="hover:text-gray-300">Home</Link>
                    {user ? (
                        <>
                            {}
                            <span className="text-gray-300">Bienvenido, {user.id || 'Usuario'}</span> {}
                            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-gray-300">Login</Link>
                            <Link to="/register" className="hover:text-gray-300">Registro</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar; 