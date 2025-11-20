import React, { useState } from 'react';
import { registerUser } from '../../services/auth';
// CORRECCIÓN AQUÍ ABAJO: Añadimos Link a la importación
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
    const [username, setUsername] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            // Nota mental: Asumimos que registerUser funciona bien. 
            // Si falla, revisaremos services/auth.js después.
            await registerUser({ username, email, password });
            setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
            
            // Pequeña mejora: esperar 1.5 segundos para que el usuario lea el mensaje de éxito antes de redirigir
            setTimeout(() => {
                navigate('/login');
            }, 1500);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Error de registro. Inténtalo de nuevo.');
            console.error("Registration failed:", err);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Registrarse</h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                        Nombre de Usuario:
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                        Contraseña:
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
                >
                    Registrarse
                </button>
                <p className="text-center text-sm text-gray-600 mt-4">
                    ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-500 hover:underline">Inicia sesión</Link>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;