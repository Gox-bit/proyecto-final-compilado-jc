import React, { useState } from 'react';

// CAMBIO 1: Asegurarnos de leer las propiedades en español si estamos editando
function ReviewForm({ gameId, onSubmit, initialReview = null }) {
    // Si initialReview existe, leemos 'calificacion' y 'comentario'
    const [rating, setRating] = useState(initialReview ? initialReview.calificacion : 5);
    const [comment, setComment] = useState(initialReview ? initialReview.comentario : '');
    const [loading, setLoading] = useState(false);

// En src/components/reviews/ReviewForm.jsx

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // CORRECCIÓN AQUÍ: 
            // Cambiamos 'calificacion' por 'puntuacion' (tal como lo pide tu Modelo)
            await onSubmit({ 
                puntuacion: rating,  // <--- ¡ESTA ES LA CLAVE!
                comentario: comment 
            });
            
            setComment('');
            setRating(5);
        } catch (error) {
            console.error("Error al enviar reseña:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
            {/* ... El resto del JSX se queda EXACTAMENTE IGUAL ... */}
            <h3 className="text-xl font-semibold mb-4">{initialReview ? "Editar Reseña" : "Añadir Nueva Reseña"}</h3>
            <div className="mb-4">
                <label htmlFor="rating" className="block text-gray-700 text-sm font-bold mb-2">
                    Calificación:
                </label>
                <select
                    id="rating"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    required
                >
                    {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} Estrellas</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="comment" className="block text-gray-700 text-sm font-bold mb-2">
                    Comentario:
                </label>
                <textarea
                    id="comment"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                ></textarea>
            </div>
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={loading}
            >
                {loading ? 'Enviando...' : (initialReview ? 'Actualizar Reseña' : 'Publicar Reseña')}
            </button>
        </form>
    );
}

export default ReviewForm;