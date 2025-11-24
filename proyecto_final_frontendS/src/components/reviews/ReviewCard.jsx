import React, { useState } from 'react';
import { Star, Edit2, Trash2, Save, X, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReviewCard = ({ review, currentUserId, currentUserRole, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editComment, setEditComment] = useState(review.comentario);
  const [editRating, setEditRating] = useState(review.puntuacion);
  const rawAuthorId = review.usuario?._id || review.usuario?.id || review.usuario || review.userId;
  
  const authorIdString = rawAuthorId ? String(rawAuthorId) : null;
  const currentUserIdString = currentUserId ? String(currentUserId) : null;
  
  const isOwner = currentUserIdString && authorIdString && (currentUserIdString === authorIdString);
  const isAdmin = currentUserRole === 'admin';
  const canDelete = isOwner || isAdmin;
  const canEdit = isOwner; 
  
  const authorName = review.usuario?.username || review.usuario?.nombre || "Usuario";

  const handleSave = () => {
    onUpdate(review._id, { comentario: editComment, puntuacion: editRating });
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-4 shadow-lg transition-all hover:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        
        {/* SECCIÓN USUARIO */}
        <div className="flex items-center gap-3">
          
          {/* 1. Avatar Clickeable */}
          <Link 
            to={`/profile/${rawAuthorId}`} 
            className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-purple-500 hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-sm"
            title="Ver perfil"
          >
            {review.usuario?.username ? (
                 <span className="font-bold text-sm">{review.usuario.username.charAt(0).toUpperCase()}</span>
            ) : (
                 <User className="h-6 w-6" />
            )}
          </Link>
          
          <div>
            {/* 2. Nombre Clickeable */}
            <Link to={`/profile/${rawAuthorId}`} className="group">
                <h4 className="text-white font-bold text-sm group-hover:text-purple-400 transition-colors inline-block">
                    {authorName}
                </h4>
            </Link>

            {isAdmin && isOwner && <span className="text-[10px] bg-red-500 text-white px-1 rounded ml-2 align-middle">ADMIN</span>}
            
            <span className="block text-xs text-gray-500 mt-0.5">
              {new Date(review.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {/* PUNTUACIÓN */}
        <div className="flex items-center gap-1 bg-gray-950 px-3 py-1 rounded-full border border-gray-800">
           {isEditing ? (
             <select value={editRating} onChange={(e) => setEditRating(Number(e.target.value))} className="bg-transparent text-yellow-400 font-bold text-sm outline-none cursor-pointer">
               {[1, 2, 3, 4, 5].map(n => <option key={n} value={n} className="bg-gray-900">{n}</option>)}
             </select>
           ) : (
             <span className="text-yellow-400 font-bold text-sm">{review.puntuacion}</span>
           )}
           <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        </div>
      </div>

      {/* COMENTARIO */}
      <div className="mb-4">
        {isEditing ? (
          <textarea 
            value={editComment} 
            onChange={(e) => setEditComment(e.target.value)} 
            className="w-full bg-gray-950 border border-purple-500/50 rounded p-3 text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500" 
            rows={3}
          />
        ) : (
          <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{review.comentario}</p>
        )}
      </div>

      {/* BOTONES DE ACCIÓN */}
      {(canEdit || canDelete) && (
        <div className="flex justify-end gap-2 pt-4 border-t border-gray-800">
          {isEditing ? (
            <>
               <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white px-3 py-1 transition-colors"><X className="h-4 w-4"/></button>
               <button onClick={handleSave} className="text-purple-400 hover:text-purple-300 px-3 py-1 transition-colors"><Save className="h-4 w-4"/></button>
            </>
          ) : (
            <>
              {canEdit && (
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium text-gray-400 hover:text-blue-400 transition-colors">
                    <Edit2 className="h-3 w-3" /> Editar
                  </button>
              )}
              
              {canDelete && (
                  <button 
                    onClick={() => { if(window.confirm('¿Eliminar reseña?')) onDelete(review._id); }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" /> Eliminar
                  </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;