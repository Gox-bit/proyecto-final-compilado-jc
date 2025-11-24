import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Gamepad2, Menu, X, LogOut, User, LogIn, UserPlus, PlusCircle } from 'lucide-react';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const handleHomeClick = () => {
        setIsMenuOpen(false); 
        navigate('/');    
        window.dispatchEvent(new Event('reset-pagination'));
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    // -------------------------------------

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    <Link to="/" className="flex items-center gap-2 group" onClick={handleHomeClick}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-purple-600 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                            <Gamepad2 className="relative h-8 w-8 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent tracking-tight">
                            GameHub
                        </span>
                    </Link>
                    
                    <div className="hidden md:flex items-center gap-6">
                        
                        <Link 
                            to="/" 
                            onClick={handleHomeClick}
                            className={`relative text-sm font-bold transition-colors duration-300 ${
                                isActive('/') ? 'text-white' : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Home
                            {isActive('/') && (
                                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span>
                            )}
                        </Link>
                        
                        <div className="h-6 w-px bg-gray-800"></div>

                        {user ? (
                            <div className="flex items-center gap-4">
                           
                                {user.role === 'admin' && (
                                    <Link 
                                        to="/admin/create-game" 
                                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-600/20 text-purple-400 border border-purple-600/50 rounded-lg hover:bg-purple-600 hover:text-white transition-all mr-2 text-sm font-bold"
                                    >
                                        <PlusCircle size={16} /> 
                                        <span>Nuevo Juego</span>
                                    </Link>
                                )}

                               <Link to="/profile" className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-gray-900 border border-gray-800 group hover:border-purple-500/50 transition-colors cursor-pointer">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                                        {user.username ? user.username.charAt(0).toUpperCase() : <User size={16} />}
                                    </div>
                                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                                        {user.username || "Jugador"}
                                    </span>
                                </Link>

                                <button 
                                    onClick={handleLogout} 
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all duration-300"
                                    title="Cerrar Sesión"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link 
                                    to="/login" 
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                                        isActive('/login') 
                                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                                            : 'text-gray-400 hover:text-purple-400 hover:bg-gray-900'
                                    }`}
                                >
                                    <LogIn size={16} />
                                    Login
                                </Link>

                                <Link 
                                    to="/register" 
                                    className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-green-900/20 hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <UserPlus size={16} />
                                    Registro
                                </Link>
                            </div>
                        )}
                    </div>

         
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            className="text-gray-300 hover:text-white p-2"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

       
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-gray-900 border-b border-gray-800 px-4 pt-2 pb-6 space-y-3 shadow-xl">
                    
    
                    <Link 
                        to="/" 
                        onClick={handleHomeClick}
                        className={`block px-4 py-3 rounded-lg font-medium ${isActive('/') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}`}
                    >
                        Home
                    </Link>

                    {user ? (
                        <>  
                       
                            {user.role === 'admin' && (
                                <Link 
                                    to="/admin/create-game" 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-2 px-4 py-3 bg-purple-600/10 text-purple-400 rounded-lg font-medium border border-purple-600/20 hover:bg-purple-600/20"
                                >
                                    <PlusCircle size={18} /> Nuevo Juego
                                </Link>
                            )}

                            <div className="px-4 py-3 flex items-center gap-3 border-t border-gray-800 mt-2">
                                <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div className="text-gray-300">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Conectado como</p>
                                    <p className="font-bold">{user.username}</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleLogout} 
                                className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-lg font-medium transition-colors"
                            >
                                <LogOut size={18} /> Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-800">
                            <Link 
                                to="/login" 
                                onClick={() => setIsMenuOpen(false)}
                                className="flex justify-center items-center gap-2 px-4 py-3 bg-gray-800 text-purple-400 rounded-lg font-bold hover:bg-gray-700 transition-colors"
                            >
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                onClick={() => setIsMenuOpen(false)}
                                className="flex justify-center items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500 transition-colors"
                            >
                                Registro
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;