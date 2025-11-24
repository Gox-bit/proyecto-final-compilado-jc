import React, { useEffect, useState } from 'react';
import { getGames } from './../services/games';
import { Search, Zap, Filter, Sparkles } from 'lucide-react';
import GameCard from '../components/games/GameCard';
import GameCardSkeleton from '../components/games/GameCardSkeleton';
const HomePage = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("Todos");
    const [userPreference, setUserPreference] = useState(localStorage.getItem('userPreference'));
    const [currentPage, setCurrentPage] = useState(1);
    const [gamesPerPage] = useState(20); 
    const [jumpPage, setJumpPage] = useState(""); 

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


        const handleReset = () => {
            setCurrentPage(1);
            setSearchTerm("");
            setSelectedGenre("Todos");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        const handlePreferenceUpdate = () => {
            setUserPreference(localStorage.getItem('userPreference'));
        };

        window.addEventListener('reset-pagination', handleReset);
        window.addEventListener('preference-updated', handlePreferenceUpdate);

        return () => {
            window.removeEventListener('reset-pagination', handleReset);
            window.removeEventListener('preference-updated', handlePreferenceUpdate);
        };
    }, []);


    const uniqueGenres = ["Todos", ...new Set(games.map(game => game.genero).filter(Boolean))];

    const filteredGames = games.filter(game => {
        const matchesSearch = game.titulo && game.titulo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = selectedGenre === "Todos" || game.genero === selectedGenre;
        return matchesSearch && matchesGenre;
    });

 
    const recommendedGames = userPreference 
        ? games.filter(game => game.genero === userPreference).slice(0, 4)
        : [];


    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);
    const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    const handleJumpToPage = (e) => {
        e.preventDefault();
        const pageNumber = parseInt(jumpPage);

        if (pageNumber >= 1 && pageNumber <= totalPages) {
            paginate(pageNumber);
            setJumpPage(""); 
        }
    };
  
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedGenre]);

   return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans pb-12">
            
            {/* HEADER (Siempre visible) */}
            <header className="py-12 px-4 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-purple-900/10 blur-3xl -z-10 rounded-full opacity-50 pointer-events-none"></div>
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
                    Descubre tu próxima <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">aventura</span>
                </h1>
                
                {/* BUSCADOR */}
                <div className="relative max-w-md mx-auto group mt-8">
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* RECOMENDADOS */}
                {!loading && !searchTerm && recommendedGames.length > 0 && selectedGenre === "Todos" && (
                    <div className="mb-12 animate-fade-in-up">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="text-purple-400 h-6 w-6 fill-current animate-pulse" />
                            <h2 className="text-2xl font-bold text-white">
                                Porque te gusta <span className="text-purple-400">{userPreference}</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {recommendedGames.map((game) => (
                                <GameCard key={game._id || game.id} game={game} />
                            ))}
                        </div>
                        <div className="h-px bg-gray-800 w-full mt-8"></div>
                    </div>
                )}

                {/* FILTROS */}
                {!loading && (
                    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide animate-fade-in">
                        <Filter className="h-5 w-5 text-gray-500 min-w-[20px]" />
                        <div className="flex gap-2">
                            {uniqueGenres.map((genre) => (
                                <button
                                    key={genre}
                                    onClick={() => setSelectedGenre(genre)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                                        selectedGenre === genre 
                                        ? 'bg-purple-600 text-white shadow-lg' 
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* TÍTULO */}
                <div className="flex items-center gap-2 mb-6">
                    <Zap className="text-yellow-400 h-6 w-6 fill-current" />
                    <h2 className="text-2xl font-bold text-white">
                        {loading ? "Cargando biblioteca..." : (selectedGenre === "Todos" ? "Todos los Juegos" : `Juegos de ${selectedGenre}`)}
                    </h2>
                </div>

                {/* GRID PRINCIPAL CON LÓGICA SKELETON */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        Array.from({ length: 12 }).map((_, index) => (
                            <GameCardSkeleton key={index} />
                        ))
                    ) : (
                        currentGames.length > 0 ? (
                            currentGames.map((game) => (
                                <GameCard key={game._id || game.id} game={game} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-gray-900/50 rounded-xl border border-gray-800 border-dashed">
                                <p className="text-gray-400 text-lg">No encontramos juegos.</p>
                                <button 
                                    onClick={() => {setSelectedGenre("Todos"); setSearchTerm("")}}
                                    className="mt-4 text-purple-400 hover:text-purple-300 underline"
                                >
                                    Ver todos
                                </button>
                            </div>
                        )
                    )}
                </div>

                {/* PAGINACIÓN */}
                {!loading && totalPages > 1 && (
                    <div className="space-y-4 mb-8 mt-12">
                        <div className="flex justify-center items-center gap-4">
                            <button 
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                ← Anterior
                            </button>

                            <span className="text-gray-400 font-mono text-sm">
                                Página <span className="text-white font-bold text-base">{currentPage}</span> de {totalPages}
                            </span>

                            <button 
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Siguiente →
                            </button>
                        </div>
                        
                        <form onSubmit={handleJumpToPage} className="flex justify-center items-center gap-2 bg-gray-900/50 p-1.5 rounded-lg border border-gray-800 w-fit mx-auto">
                            <span className="text-xs text-gray-500 font-bold uppercase ml-2">Ir a:</span>
                            <input 
                                type="number" 
                                min="1" 
                                max={totalPages}
                                value={jumpPage}
                                onChange={(e) => setJumpPage(e.target.value)}
                                placeholder="#"
                                className="w-12 bg-gray-800 border border-gray-700 text-white text-center rounded py-1 text-sm focus:outline-none focus:border-purple-500 transition-colors appearance-none"
                            />
                            <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white p-1.5 rounded transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;