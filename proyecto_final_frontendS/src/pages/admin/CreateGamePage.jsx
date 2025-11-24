import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame } from '../../services/games'; 
import { Gamepad2, Save } from 'lucide-react';

function CreateGamePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        titulo: '',
        genero: '',
        año: new Date().getFullYear(),
        descripcion: '',
        img: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
      
            const dataToSend = {
                ...formData,
                año: parseInt(formData.año)
            };

            await createGame(dataToSend); 
            
            alert('¡Juego creado con éxito!');
            navigate('/'); 
        } catch (error) {
            console.error(error);
            alert('Error al crear el juego. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
            <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl">
                
                <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                    <div className="bg-purple-600 p-2 rounded-lg">
                        <Gamepad2 className="text-white h-6 w-6" />
                    </div>
          
                    <h2 className="text-2xl font-bold text-white">Agregar Nuevo Juego</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
         
                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2">Título del Juego</label>
                        <input
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg p-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                            placeholder="Ej: God of War"
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
                                className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg p-3 focus:border-purple-500 outline-none"
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
                            <label className="block text-gray-400 text-sm font-bold mb-2">Año de Salida</label>
                            <input
                                type="number"
                                name="año"
                                value={formData.año}
                                onChange={handleChange}
                                className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg p-3 focus:border-purple-500 outline-none"
                                placeholder="2024"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2">Descripción / Sinopsis</label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            rows="3"
                            className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg p-3 focus:border-purple-500 outline-none resize-none"
                            placeholder="Breve descripción del juego..."
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm font-bold mb-2">URL de Imagen (Portada)</label>
                        <input
                            type="url"
                            name="img"
                            value={formData.img}
                            onChange={handleChange}
                            className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg p-3 focus:border-purple-500 outline-none"
                            placeholder="https://..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg shadow-green-900/20 disabled:opacity-50"
                    >

                        <Save size={20} /> {loading ? 'Guardando...' : 'Guardar Juego'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateGamePage;