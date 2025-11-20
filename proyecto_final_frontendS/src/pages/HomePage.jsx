import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGames } from './../services/games';
import { Star, ArrowRight, Search, Zap } from 'lucide-react';
import { getGameImageByTitle } from './../utils/gameImages'; 

const HomePage = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const data = await getGames();
                setGames(data || []);
            } catch (error) {
                console.error("Error cargando juegos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    const getGameImage = (game) => {
        return getGameImageByTitle(game.titulo, game.img);
    };

    const filteredGames = games.filter(game => 
        game.titulo && game.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans pb-12">
            
            {/* --- HERO --- */}
            <header className="py-12 px-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-purple-900/10 blur-3xl -z-10 rounded-full opacity-50 pointer-events-none"></div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
                    Descubre tu próxima <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">aventura</span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg">
                    Explora reseñas honestas, comparte tu opinión y encuentra joyas ocultas.
                </p>
                
                <div className="relative max-w-md mx-auto group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        className="block w-full pl-11 pr-4 py-3 border border-gray-800 rounded-full leading-5 bg-gray-900/80 backdrop-blur-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:bg-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-lg" 
                        placeholder="Busca un juego..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            {}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 mb-6">
                    <Zap className="text-yellow-400 h-6 w-6 fill-current" />
                    <h2 className="text-2xl font-bold text-white">Juegos Destacados</h2>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredGames.map((game) => (
                            <Link to={`/game/${game._id || game.id}`} key={game._id || game.id} className="block group">
                                <div className="relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
                                    
                                    {/* IMAGEN */}
                                    <div className="relative h-56 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80 z-10"/>
                                        <img 
                                            src={getGameImage(game)} 
                                            alt={game.titulo} 
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-gray-700 shadow-lg">
                                           <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                                           <span className="text-xs font-bold text-white">
                                             {game.puntuacionPromedio ? game.puntuacionPromedio.toFixed(1) : "-"}
                                           </span>
                                        </div>
                                    </div>

                                    {}
                                    <div className="p-5 flex flex-col flex-grow relative z-20">
                                        <div className="mb-4">
                                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 mb-2 border border-purple-500/20">
                                                {game.genero}
                                            </span>
                                            <h3 className="text-lg font-bold text-white leading-tight group-hover:text-purple-400 transition-colors line-clamp-2">
                                                {game.titulo}
                                            </h3>
                                        </div>
                                        
                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-800/50">
                                            <span className="text-xs text-gray-500 font-medium">Ver detalles</span>
                                            <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                                                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;