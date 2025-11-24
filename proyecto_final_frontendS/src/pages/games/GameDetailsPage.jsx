import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getGameById, deleteGame } from '../../services/games';
import { getReviewsByGame, createReview, updateReview, deleteReview } from '../../services/reviews';
import { useAuth } from '../../contexts/AuthContext';
import ReviewForm from '../../components/reviews/ReviewForm';
import ReviewCard from '../../components/reviews/ReviewCard';
import { Star, Calendar, MessageSquare, LayoutGrid, Edit, Trash2, AlignLeft, ListPlus } from 'lucide-react';
import UserStatsManager from '../../components/games/UserStatsManager';
import AddToListModal from '../../components/lists/AddToListModal';
import { getGameImageByTitle } from '../../utils/gameImages';

function GameDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [game, setGame] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para el modal de listas
    const [isListModalOpen, setIsListModalOpen] = useState(false);

    const fetchGameAndReviews = async () => {
        try {
            setLoading(true);
            const gameData = await getGameById(id);
            setGame(gameData);

            const reviewsData = await getReviewsByGame(id);
            setReviews(reviewsData || []);
        } catch (err) {
            setError('Error al cargar los datos.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGameAndReviews();
    }, [id]);

    const handleDeleteGame = async () => {
        if (window.confirm("⚠️ ¿Estás seguro de eliminar ESTE JUEGO y todas sus reseñas? Esta acción no se puede deshacer.")) {
            try {
                await deleteGame(id);
                alert("Juego eliminado correctamente.");
                navigate('/');
            } catch (error) {
                console.error(error);
                alert("Error al eliminar el juego.");
            }
        }
    };

    const handleNewReview = async (reviewData) => {
        try {
            await createReview(id, reviewData);
            fetchGameAndReviews();
        } catch (err) {
            alert("Error al crear reseña.");
        }
    };

    const handleUpdateReview = async (reviewId, reviewData) => {
        try {
            await updateReview(reviewId, reviewData);
            fetchGameAndReviews();
        } catch (err) {
            alert("Error al actualizar reseña.");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteReview(reviewId);
            fetchGameAndReviews();
        } catch (err) {
            alert("Error al eliminar reseña.");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center text-red-400">
            <p>{error}</p>
        </div>
    );

    if (!game) return <div className="min-h-screen bg-gray-950 text-white p-10">Juego no encontrado.</div>;

    const heroImage = getGameImageByTitle(game.titulo, game.img);

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans pb-10">
            
            {/* HEADER / PORTADA */}
            <div className="relative h-80 w-full overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src={heroImage} 
                        alt={game.titulo}
                        className="w-full h-full object-cover filter blur-sm opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-transparent" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-end pb-8">
                    
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <span className="inline-block px-3 py-1 bg-purple-600/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full mb-2 w-fit">
                                {game.genero}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2 shadow-lg leading-tight">
                                {game.titulo}
                            </h1>
                        </div>

                        {user && user.role === 'admin' && (
                            <div className="flex gap-2 mb-2 bg-black/40 backdrop-blur-md p-2 rounded-xl border border-white/10">
                                <Link 
                                    to={`/admin/edit-game/${id}`}
                                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg"
                                    title="Editar Juego"
                                >
                                    <Edit size={20} />
                                </Link>
                                <button 
                                    onClick={handleDeleteGame}
                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-lg"
                                    title="Eliminar Juego"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm md:text-base text-gray-300">
                        <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="h-5 w-5 fill-current" />
                            <span className="font-bold text-white text-lg">
                                {game.puntuacionPromedio ? game.puntuacionPromedio.toFixed(1) : 'N/A'}
                            </span>
                        </div>
                        <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" /> {reviews ? reviews.length : 0} Reseñas
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" /> {game.año || new Date().getFullYear()}
                        </span>
                    </div>
                </div>
            </div>

            {/* LAYOUT DE DOS COLUMNAS */}
            <div className="max-w-7xl mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* COLUMNA IZQUIERDA (2/3): Sinopsis y Reseñas */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Sinopsis */}
                        {game.descripcion && (
                            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <AlignLeft className="text-purple-500" /> Sinopsis
                                </h2>
                                <p className="text-gray-300 leading-relaxed">
                                    {game.descripcion}
                                </p>
                            </div>
                        )}

                        {/* Formulario de Reseña */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Star className="text-purple-500" /> Deja tu opinión
                            </h2>
                            {user ? (
                                <ReviewForm gameId={id} onSubmit={handleNewReview} />
                            ) : (
                                <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
                                    <p className="text-gray-400 mb-4">Necesitas una cuenta para unirte a la discusión.</p>
                                    <Link 
                                        to="/login" 
                                        className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                </div>
                            )}
                        </div>
                            
                        {/* Lista de Reseñas */}
                        <div>
                            <h3 className="text-xl font-semibold text-gray-200 mb-4 border-b border-gray-800 pb-2">
                                Comentarios de la comunidad
                            </h3>
                            <div className="space-y-4">
                                {reviews.length > 0 ? (
                                    reviews.map(review => (
                                        <ReviewCard
                                            key={review._id}
                                            review={review}
                                            currentUserId={user ? user.id : null}
                                            currentUserRole={user ? user.role : null}
                                            onUpdate={handleUpdateReview}
                                            onDelete={handleDeleteReview}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <LayoutGrid className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                        <p>No hay reseñas todavía. ¡Sé el primero en opinar!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA (1/3): Estadísticas y Listas */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            
                            {/* ESTADÍSTICAS DE USUARIO */}
                            {user ? (
                                <UserStatsManager 
                                    gameId={id} 
                                    gameTitle={game.titulo}
                                    totalLogrosReales={game.totalLogros} 
                                />
                            ) : (
                                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 text-center">
                                    <p className="text-gray-400 mb-4 text-sm">
                                        Inicia sesión para registrar tus horas y logros.
                                    </p>
                                    <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold text-sm">
                                        Conectarse
                                    </Link>
                                </div>
                            )}

                            {/* BOTÓN DE AÑADIR A LISTA (NUEVO) */}
                            {user && (
                                <>
                                    <button 
                                        onClick={() => setIsListModalOpen(true)}
                                        className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-all border border-gray-700 hover:border-gray-600 shadow-lg"
                                    >
                                        <ListPlus size={20} /> Añadir a una Lista
                                    </button>

                                    <AddToListModal 
                                        isOpen={isListModalOpen} 
                                        onClose={() => setIsListModalOpen(false)} 
                                        gameId={id}
                                    />
                                </>
                            )}

                            {/* Info Adicional */}
                            <div className="mt-6 bg-gray-900/30 border border-gray-800 rounded-xl p-4">
                                <h4 className="text-sm font-bold text-gray-400 uppercase mb-3">Información</h4>
                                <div className="space-y-2 text-sm text-gray-300">
                                    <div className="flex justify-between">
                                        <span>Lanzamiento</span>
                                        <span className="text-white">{game.año}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Género</span>
                                        <span className="text-purple-400">{game.genero}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default GameDetailsPage;