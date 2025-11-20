import React from 'react';
import { Link } from 'react-router-dom';

function GameCard({ game }) { 
    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            {/* Cambiar game.title a game.titulo */}
            <h2 className="text-xl font-bold mb-2">{game.titulo}</h2> 
            
            {/* Cambiar game.genre a game.genero */}
            <p className="text-gray-600 mb-2">Género: {game.genero}</p>
            
            {/* Cambiar game.averageRating a game.puntuacionPromedio */}
            <p className="text-gray-700">
                Calificación: {game.puntuacionPromedio ? game.puntuacionPromedio.toFixed(1) : 'N/A'}
            </p>
            
            {/* game._id está bien */}
            <Link to={`/games/${game._id}`} className="text-blue-500 hover:underline mt-4 block">Ver Detalles</Link>
        </div>
    );
}

export default GameCard;