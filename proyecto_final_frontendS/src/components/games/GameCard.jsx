import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function GameCard({ game }) {
    const { 
        titulo = "Juego sin título", 
        genero = "General", 
        rating = 0, 
        calificacion = 0, 
        _id,
        imagen,
        imageUrl
    } = game;

    const displayRating = rating || calificacion || "-";
    const displayImage = imagen || imageUrl || `https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=500&q=80`;

    return (
        <div className="group relative bg-[#151921] border border-gray-800 rounded-2xl overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-purple-900/20 hover:-translate-y-1 transition-all duration-300 h-full">
            
            {}
            <div className="relative h-52 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#151921] via-transparent to-transparent z-10 opacity-80" />
                
                <img 
                    src={displayImage} 
                    alt={titulo} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=GameHub" }} 
                />

                <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-gray-700 shadow-lg">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-bold text-white">{typeof displayRating === 'number' ? displayRating.toFixed(1) : displayRating}</span>
                </div>
            </div>

            {}
            <div className="p-5 flex flex-col flex-grow">
                <div className="mb-4">
                    <span className="inline-block py-1 px-2.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider mb-2 border border-purple-500/20">
                        {genero}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-tight group-hover:text-purple-400 transition-colors line-clamp-2">
                        {titulo}
                    </h3>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-800">
                    <Link 
                        to={`/games/${_id}`} 
                        className="flex items-center justify-between text-gray-400 hover:text-white text-sm font-medium transition-colors group/btn"
                    >
                        Ver detalles
                        <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default GameCard;