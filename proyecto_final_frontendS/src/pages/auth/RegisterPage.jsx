import React, { useState } from 'react';
import { registerUser } from '../../services/auth';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Gamepad2 } from 'lucide-react';

function RegisterPage() {
    const [username, setUsername] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            await registerUser({ username, email, password });
            setSuccess('¡Cuenta creada con éxito!');
            
            setTimeout(() => {
                navigate('/login');
            }, 1500);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrarse. Inténtalo de nuevo.');
            console.error("Registration failed:", err);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-950 px-4 relative overflow-hidden">
             {/* Decoración de fondo (variante rosada/azul para diferenciar) */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl -z-10"></div>

            <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-sm">
                
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-4 text-green-500">
                        <Gamepad2 size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h2>
                    <p className="text-gray-400 text-sm">Únete a la comunidad de GameHub</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm mb-6 text-center">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Nombre de Usuario</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-white placeholder-gray-600 transition-colors"
                                placeholder="GamerPro123"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="email"
                                className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-white placeholder-gray-600 transition-colors"
                                placeholder="tu@email.com"
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
                                className="w-full pl-10 pr-4 py-3 bg-gray-950 border border-gray-700 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-white placeholder-gray-600 transition-colors"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Registrando...' : <><UserPlus size={20} /> Registrarse</>}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-green-400 hover:text-green-300 font-medium transition-colors">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;