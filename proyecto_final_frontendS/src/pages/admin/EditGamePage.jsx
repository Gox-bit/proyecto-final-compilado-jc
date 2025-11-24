import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGameById, updateGame } from '../../services/games';
import { Gamepad2, Save, Loader2 } from 'lucide-react';

function EditGamePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        titulo: '', 
        genero: '', 
        año: '', 
        descripcion: '', 
        img: ''
    });

    useEffect(() => {
        const loadGame = async () => {
            try {
                const data = await getGameById(id);
                if (data) {
                    setFormData({
                        titulo: data.titulo || '',
                        genero: data.genero || '',
                        año: data.año || '',
                        descripcion: data.descripcion || '',
                        img: data.img || ''
                    });
                }
            } catch (error) {
                alert("Error al cargar el juego");
            } finally {
                setLoading(false);
            }
        };
        loadGame();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateGame(id, formData);
            alert('¡Juego actualizado!');
            navigate(`/game/${id}`); 
        } catch (error) {
            console.error(error);
            alert('Error al actualizar.');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex justify-center items-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl">
                
                <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Gamepad2 className="text-white h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Editar Juego</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
           
                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2">Título</label>
                        <input 
                            type="text" 
                            name="titulo" 
                            value={formData.titulo} 
                            onChange={handleChange} 
                            className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg p-3 focus:border-blue-500 outline-none" 
                            required 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                        <div className="md:col-span-2">
                            <label className="block text-gray-400 text-sm font-bold mb-2">Género</label>
                            <select 
                                name="genero" 
                                value={formData.genero} 
                                onChange={handleChange} 
                                className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg p-3 focus:border-blue-500 outline-none" 
                                required
                            >
                                <option value="">Selecciona...</option>
                                <option value="Aventura">Aventura</option>
                                <option value="Acción">Acción</option>
                                <option value="RPG">RPG</option>
                                <option value="Deportes">Deportes</option>
                                <option value="Carreras">Carreras</option>
                                <option value="Battle Royale">Battle Royale</option>
                                <option value="Terror">Terror</option>
                                <option value="Estrategia">Estrategia</option>
                                <option value="Batallas">Batallas</option>
                            </select>
                        </div>

                
                        <div>
                            <label className="block text-gray-400 text-sm font-bold mb-2">Año</label>
                            <input 
                                type="number" 
                                name="año" 
                                value={formData.año} 
                                onChange={handleChange} 
                                className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg p-3 focus:border-blue-500 outline-none" 
                                required 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2">Descripción</label>
                        <textarea 
                            name="descripcion" 
                            value={formData.descripcion} 
                            onChange={handleChange} 
                            rows="3" 
                            className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg p-3 focus:border-blue-500 outline-none resize-none" 
                        />
                    </div>

          
                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2">Imagen URL</label>
                        <input 
                            type="url" 
                            name="img" 
                            value={formData.img} 
                            onChange={handleChange} 
                            className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg p-3 focus:border-blue-500 outline-none" 
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
                    >
                        <Save size={20} /> Guardar Cambios
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditGamePage;