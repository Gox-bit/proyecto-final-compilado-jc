import React, { useState } from 'react';
import { Star, Edit2, Trash2, Save, X, User } from 'lucide-react';

const ReviewCard = ({ review, currentUserId, onUpdate, onDelete }) => {
  // Estado para controlar si estamos editando esta tarjeta
  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState(review.comentario);
  const [editRating, setEditRating] = useState(review.puntuacion);

  // ------------------------------------------------------
  // 1. LÓGICA DE IDENTIFICACIÓN (ID SAFE CHECK)
  // ------------------------------------------------------
  
  // Intenta obtener el ID del autor, ya sea objeto poblado o string simple
  const rawAuthorId = review.usuario?._id || review.usuario?.id || review.usuario || review.userId;
  
  // Convertimos todo a String para evitar errores de tipo (ej: "1" vs 1)
  const authorIdString = rawAuthorId ? String(rawAuthorId) : null;
  const currentUserIdString = currentUserId ? String(currentUserId) : null;
  
  // Obtenemos el nombre para mostrar
  const authorName = review.usuario?.username || review.usuario?.nombre || "Usuario";
  
  // Determinamos si es el dueño
  const isOwner = currentUserIdString && authorIdString && (currentUserIdString === authorIdString);

  // --- DEBUG CORREGIDO ---
  // Abre la consola del navegador (F12) para ver esto
  console.log(`Review ${review._id}:`, {
      Yo: currentUserIdString,
      Autor: authorIdString,
      EsMio: isOwner
  });
  // -----------------------

  const handleSave = () => {
    onUpdate(review._id, { 
      comentario: editComment, 
      puntuacion: editRating 
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditComment(review.comentario);
    setEditRating(review.puntuacion);
    setIsEditing(false);
  };
  
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-4 shadow-lg hover:shadow-purple-900/10 transition-all duration-300">
      {/* --- HEADER DE LA TARJETA --- */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-purple-500">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">{authorName}</h4>
            <span className="text-xs text-gray-500">
              {new Date(review.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* --- ESTRELLAS (Visualización o Edición) --- */}
        <div className="flex items-center gap-1 bg-gray-950 px-3 py-1 rounded-full border border-gray-800">
          {isEditing ? (
            <select 
              value={editRating} 
              onChange={(e) => setEditRating(Number(e.target.value))}
              className="bg-transparent text-yellow-400 font-bold text-sm focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num} className="bg-gray-900 text-white">
                  {num}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-yellow-400 font-bold text-sm">{review.puntuacion}</span>
          )}
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        </div>
      </div>

      {/* --- CUERPO (Texto o Textarea) --- */}
      <div className="mb-4">
        {isEditing ? (
          <textarea
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all resize-none"
            rows="3"
          />
        ) : (
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
            {review.comentario}
          </p>
        )}
      </div>

      {/* --- ACCIONES (Botones) --- */}
      {isOwner && (
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-800">
          {isEditing ? (
            <>
              <button 
                onClick={handleCancel}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <X className="h-3 w-3" /> Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20"
              >
                <Save className="h-3 w-3" /> Guardar
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-blue-400 transition-colors group"
              >
                <Edit2 className="h-3 w-3 group-hover:scale-110 transition-transform" /> Editar
              </button>
              <button 
                onClick={() => {
                  if(window.confirm('¿Seguro que quieres eliminar esta reseña?')) {
                    onDelete(review._id);
                  }
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors group"
              >
                <Trash2 className="h-3 w-3 group-hover:scale-110 transition-transform" /> Eliminar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;