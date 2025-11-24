import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserProfileStats, getPublicProfileStats } from '../../services/games';
import { getUserLists, deleteList } from '../../services/lists';
import { Link, useParams } from 'react-router-dom';
import { Trophy, Clock, Gamepad2, CheckCircle, List, User, Plus, Trash2, Layers } from 'lucide-react';
import CreateListModal from '../../components/lists/CreateListModal'; 

const ProfilePage = () => {
    const { user: currentUser } = useAuth();
    const { userId } = useParams();
    
    const [stats, setStats] = useState([]);
    const [lists, setLists] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [profileUser, setProfileUser] = useState(null);
    const [filter, setFilter] = useState('Todos');
    
    const [activeTab, setActiveTab] = useState('collection');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const loadData = async () => {
        const targetId = userId || currentUser?.id;
        if (!targetId) return;

        try {
            if (userId) {
                const response = await getPublicProfileStats(userId);
                if (response.userProfile) {
                    setProfileUser(response.userProfile);
                    setStats(response.stats || []);
                }
            } else {
                const data = await getUserProfileStats();
                setStats(data || []);
                setProfileUser(currentUser);
            }

            const userLists = await getUserLists(targetId);
            setLists(userLists || []);

        } catch (error) {
            console.error("Error cargando datos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [userId, currentUser]);

    const handleDeleteList = async (listId) => {
        if (window.confirm("¿Borrar esta lista?")) {
            await deleteList(listId);
            loadData();
        }
    };

    const isMyProfile = !userId || (currentUser && userId === currentUser.id);

    const totalHoras = stats.reduce((acc, curr) => acc + (curr.horasJugadas || 0), 0);
    const totalLogros = stats.reduce((acc, curr) => acc + (curr.logrosObtenidos || 0), 0);
    const filteredStats = filter === 'Todos' ? stats : stats.filter(s => s.estado === filter);

    if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Cargando...</div>;

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans pb-12">
            <CreateListModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onListCreated={loadData} 
            />

            {/* ENCABEZADO */}
            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-gray-800 pb-12 pt-24 px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1 shadow-2xl">
                        <div className="h-full w-full rounded-full bg-gray-900 flex items-center justify-center text-4xl font-bold text-white">
                            {(profileUser?.username || profileUser?.nombre || profileUser?.email || "?").charAt(0).toUpperCase()}
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-extrabold text-white mb-2">
                            {profileUser?.username || profileUser?.nombre || profileUser?.email || "Usuario"}
                        </h1>
                        <p className="text-gray-400"><span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{profileUser?.role === 'admin' ? 'Administrador' : 'Jugador'}</span></p>
                    </div>
                    <div className="md:ml-auto grid grid-cols-2 gap-4 text-center">
                        <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700"><div className="text-2xl font-bold text-yellow-400">{totalLogros}</div><div className="text-xs text-gray-400 uppercase font-bold">Logros</div></div>
                        <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-700"><div className="text-2xl font-bold text-blue-400">{totalHoras}h</div><div className="text-xs text-gray-400 uppercase font-bold">Jugadas</div></div>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 -mt-8">
                
                {/* PESTAÑAS DE NAVEGACIÓN */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-900 p-1 rounded-xl border border-gray-800 flex gap-2 shadow-lg">
                        <button 
                            onClick={() => setActiveTab('collection')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'collection' ? 'bg-gray-800 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Gamepad2 size={18} /> Colección
                        </button>
                        <button 
                            onClick={() => setActiveTab('lists')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'lists' ? 'bg-gray-800 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                        >
                            <List size={18} /> Listas
                        </button>
                    </div>
                </div>

                {/* CONTENIDO: COLECCIÓN */}
                {activeTab === 'collection' && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Trophy className="text-yellow-500" /> Colección</h2>
                            <div className="flex gap-2 bg-gray-950 p-1 rounded-lg">
                                {['Todos', 'Jugando', 'Terminado'].map(status => (
                                    <button key={status} onClick={() => setFilter(status)} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filter === status ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>{status}</button>
                                ))}
                            </div>
                        </div>
                        <div className="divide-y divide-gray-800">
                            {filteredStats.length > 0 ? (
                                filteredStats.map((stat) => (
                                    <div key={stat._id} className="p-4 hover:bg-gray-800/50 transition-colors flex items-center gap-4">
                                        <Link to={`/game/${stat.game._id}`} className="shrink-0 w-20 h-12 md:w-32 md:h-20 rounded-lg overflow-hidden border border-gray-700">
                                            <img src={stat.game.img || ''} alt={stat.game.titulo} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"/>
                                        </Link>
                                        <div className="flex-grow min-w-0">
                                            <Link to={`/game/${stat.game._id}`}><h3 className="font-bold text-white text-lg truncate hover:text-purple-400">{stat.game.titulo}</h3></Link>
                                            <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                                                <span className="flex items-center gap-1"><Clock size={14} /> {stat.horasJugadas}h</span>
                                                <span className="hidden md:flex items-center gap-1"><Trophy size={14} className="text-yellow-600" /> {stat.logrosObtenidos}/{stat.logrosTotales}</span>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase border border-gray-700 text-gray-400">{stat.estado}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-gray-500">No hay juegos en esta categoría.</div>
                            )}
                        </div>
                    </div>
                )}

                {/* CONTENIDO: LISTAS */}
                {activeTab === 'lists' && (
                    <div className="animate-fade-in-up">
                        {isMyProfile && (
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="w-full py-4 mb-6 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/5 transition-all flex items-center justify-center gap-2 font-bold"
                            >
                                <Plus size={20} /> Crear Nueva Lista
                            </button>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {lists.length > 0 ? (
                                lists.map(list => (
                                    <div key={list._id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{list.titulo}</h3>
                                                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{list.descripcion || "Sin descripción"}</p>
                                            </div>
                                            {isMyProfile && (
                                                <button onClick={() => handleDeleteList(list._id)} className="text-gray-600 hover:text-red-400 p-1">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="flex gap-2 mt-4">
                                            {/* Miniaturas de los juegos */}
                                            {list.juegos.slice(0, 3).map(game => (
                                                <div key={game._id} className="h-16 w-12 rounded bg-gray-800 overflow-hidden border border-gray-700">
                                                    <img src={game.img} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            {list.juegos.length === 0 && (
                                                <div className="h-16 w-full rounded bg-gray-800/50 border border-gray-800 border-dashed flex items-center justify-center text-gray-600 text-xs">
                                                    Vacía
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><Layers size={14} /> {list.juegos.length} Juegos</span>
                                            <span>{new Date(list.fechaCreacion).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12 text-gray-500">
                                    <List className="mx-auto h-12 w-12 opacity-20 mb-3" />
                                    <p>No hay listas creadas.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default ProfilePage;