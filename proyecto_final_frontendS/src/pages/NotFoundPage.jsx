import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-2xl mb-8">Página No Encontrada</p>
            <p className="text-lg text-center mb-8 px-4">
                Lo sentimos, la página que buscas no existe o se ha movido.
            </p>
            <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Volver a la Página de Inicio
            </Link>
        </div>
    );
}

export default NotFoundPage; 