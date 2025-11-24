import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Gamepad2 } from 'lucide-react';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login({ email, password });
            navigate('/'); 
        } catch (err) {
            setError(err.response?.data?.message || 'Credenciales incorrectas. Inténtalo de nuevo.');
            console.error("Login failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-950 px-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -z-10"></div>

            <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-sm">
                
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-purple-500">
                        <Gamepad2 size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Bienvenido</h2>
                    <p className="text-gray-400 text-sm">Ingresa a tu cuenta para continuar</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-600 transition-colors"
                                placeholder="ejemplo@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Contraseña</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-600 transition-colors"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Iniciando...' : <><LogIn size={20} /> Iniciar Sesión</>}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;