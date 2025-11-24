import React, { useEffect, useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { getUserLists, addGameToList } from '../../services/lists';
import { useAuth } from '../../contexts/AuthContext';

const AddToListModal = ({ isOpen, onClose, gameId }) => {
    const { user } = useAuth();
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        if (isOpen && user) {
            loadLists();
        }
    }, [isOpen, user]);

    const loadLists = async () => {
        setLoading(true);
        const data = await getUserLists(user.id);
        setLists(data || []);
        setLoading(false);
    };

    const handleAdd = async (listId) => {
        setProcessing(listId);
        try {
            await addGameToList(listId, gameId);
            alert("¡Juego añadido correctamente!");
            onClose();
        } catch (error) {
            alert(error);
        } finally {
            setProcessing(null);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gray-900 border border-gray-800 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                
                <div className="bg-gray-800/50 p-4 flex justify-between items-center border-b border-gray-800">
                    <h3 className="text-lg font-bold text-white">Guardar en lista</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-2 max-h-80 overflow-y-auto">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Cargando tus listas...</div>
                    ) : lists.length > 0 ? (
                        <div className="space-y-1">
                            {lists.map(list => (
                                <button
                                    key={list._id}
                                    onClick={() => handleAdd(list._id)}
                                    disabled={processing === list._id}
                                    className="w-full text-left p-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-between group"
                                >
                                    <div>
                                        <span className="block text-white font-bold text-sm">{list.titulo}</span>
                                        <span className="text-xs text-gray-500">{list.juegos.length} juegos</span>
                                    </div>
                                    {processing === list._id ? (
                                        <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                                    ) : (
                                        <Plus size={18} className="text-gray-600 group-hover:text-purple-400" />
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 px-4">
                            <p className="text-gray-400 text-sm mb-2">No tienes listas creadas.</p>
                            <p className="text-xs text-gray-600">Ve a tu perfil para crear una.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddToListModal;