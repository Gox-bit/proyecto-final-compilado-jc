import React, { useState } from 'react';
import { X, Save, List } from 'lucide-react';
import { createList } from '../../services/lists';

const CreateListModal = ({ isOpen, onClose, onListCreated }) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createList({ titulo: title, descripcion: desc });
            onListCreated(); 
            onClose();   
            setTitle('');
            setDesc('');
        } catch (error) {
            alert("Error al crear la lista");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                
                {/* Header */}
                <div className="bg-gray-800/50 p-4 flex justify-between items-center border-b border-gray-800">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <List className="text-purple-500" /> Crear Nueva Lista
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título</label>
                        <input 
                            type="text" 
                            required
                            maxLength={50}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej: Mis RPGs favoritos"
                            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción (Opcional)</label>
                        <textarea 
                            maxLength={200}
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            placeholder="Una breve descripción de esta colección..."
                            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-purple-500 focus:outline-none h-24 resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 py-2 rounded-lg text-sm font-bold text-gray-400 hover:bg-gray-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1 py-2 rounded-lg text-sm font-bold bg-purple-600 text-white hover:bg-purple-500 transition-colors flex justify-center items-center gap-2"
                        >
                            {loading ? 'Creando...' : <><Save size={16} /> Crear Lista</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateListModal;