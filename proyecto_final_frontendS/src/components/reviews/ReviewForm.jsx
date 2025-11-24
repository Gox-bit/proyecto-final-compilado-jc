import React, { useState } from 'react';
import { Send, Star } from 'lucide-react';

function ReviewForm({ gameId, onSubmit, initialReview = null }) {
    const [rating, setRating] = useState(initialReview ? initialReview.calificacion : 5);
    const [comment, setComment] = useState(initialReview ? initialReview.comentario : '');
    const [loading, setLoading] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({ 
                puntuacion: rating, 
                comentario: comment 
            });
            
            if (!initialReview) {
                setComment('');
                setRating(5);
            }
        } catch (error) {
            console.error("Error al enviar reseña:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-[#151921] border border-gray-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                {initialReview ? "Editar tu reseña" : "Comparte tu opinión"}
            </h3>
            
            <div className="mb-6">
                <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Calificación
                </label>
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="focus:outline-none transition-transform hover:scale-110"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star 
                                className={`w-8 h-8 ${
                                    star <= (hoverRating || rating) 
                                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-glow' 
                                        : 'fill-gray-800 text-gray-700'
                                } transition-colors`} 
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-gray-500 text-sm font-medium">
                        {hoverRating || rating} de 5
                    </span>
                </div>
            </div>

            {}
            <div className="mb-6">
                <label htmlFor="comment" className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                    Tu experiencia
                </label>
                <textarea
                    id="comment"
                    className="w-full bg-[#0b0e14] border border-gray-800 text-gray-100 rounded-lg p-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-600 resize-none"
                    rows="4"
                    placeholder="¿Qué te pareció la jugabilidad, los gráficos, la historia?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                ></textarea>
            </div>

            <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
            >
                {loading ? (
                    'Procesando...'
                ) : (
                    <>
                        {initialReview ? 'Actualizar' : 'Publicar Reseña'} <Send className="w-4 h-4" />
                    </>
                )}
            </button>
        </form>
    );
}

export default ReviewForm;