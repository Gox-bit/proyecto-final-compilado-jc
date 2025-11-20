import React from 'react';

function ReviewCard({ review, currentUserId, onUpdate, onDelete }) {
    // PROTECCIÓN:
    // A veces 'review.usuario' puede venir poblado (objeto) o solo como ID (string).
    // O a veces 'currentUserId' puede ser null.
    // Estas variables nos ayudan a no romper el código si algo falta.
    const authorName = review.usuario ? review.usuario.nombre : 'Usuario Desconocido';
    const authorId = review.usuario ? review.usuario._id : null;

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
                <div>
                    {/* 1. CORRECCIÓN: Usamos authorName (que viene de review.usuario.nombre) */}
                    <p className="font-bold text-lg text-gray-800">
                        {authorName}
                    </p>
                    
                    {/* 2. CORRECCIÓN: review.puntuacion en vez de review.rating */}
                    <p className="text-yellow-600 font-medium">
                        {'★'.repeat(review.puntuacion)} ({review.puntuacion} / 5)
                    </p>
                </div>
            </div>

            {/* 3. CORRECCIÓN: review.comentario en vez de review.comment */}
            <p className="text-gray-700 mt-2 mb-4 whitespace-pre-wrap">
                {review.comentario}
            </p>

            {/* 4. CORRECCIÓN: Comparamos con authorId */}
            {currentUserId && authorId && currentUserId === authorId && (
                <div className="flex space-x-2">
                    <button
                        onClick={() => onUpdate(review._id, { })} // Aquí luego definiremos qué actualizar
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded transition"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => onDelete(review._id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition"
                    >
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
}

export default ReviewCard;