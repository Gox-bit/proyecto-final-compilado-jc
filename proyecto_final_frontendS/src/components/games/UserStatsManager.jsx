import React, { useState, useEffect } from 'react';
import { getMyGameStats, saveGameStats } from '../../services/games';
import { Save, Trophy, Clock, Activity, Edit2, Lock } from 'lucide-react'; // Añadí iconos nuevos

const UserStatsManager = ({ gameId, gameTitle, totalLogrosReales = 0 }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [stats, setStats] = useState({
        horasJugadas: 0,
        logrosObtenidos: 0,
        logrosTotales: 0, 
        estado: 'Jugando'
    });


    useEffect(() => {
        const loadStats = async () => {
            if (!gameId) return;
            const data = await getMyGameStats(gameId);
            
            
            let totalDefinitivo;

            if (totalLogrosReales > 0) {
                totalDefinitivo = totalLogrosReales; 
            } else if (data && data.logrosTotales > 0) {
                totalDefinitivo = data.logrosTotales; 
            } else {
                totalDefinitivo = 10; 
            }

            if (data && data._id) {
                setStats({
                    horasJugadas: data.horasJugadas || 0,
                    logrosObtenidos: data.logrosObtenidos || 0,
                    logrosTotales: totalDefinitivo,
                    estado: data.estado || 'Jugando'
                });
            } else {
                setStats(prev => ({
                    ...prev,
                    logrosTotales: totalDefinitivo
                }));
            }
            setLoading(false);
        };
        loadStats();
    }, [gameId, totalLogrosReales]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setStats(prev => ({
            ...prev,
            [name]: name === 'estado' ? value : Number(value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (stats.logrosObtenidos > stats.logrosTotales) {
                alert(`No puedes tener más logros (${stats.logrosObtenidos}) que el total (${stats.logrosTotales})`);
                setSaving(false);
                return;
            }

            await saveGameStats({ gameId, ...stats });
            alert("¡Progreso actualizado!"); 
        } catch (error) {
            alert("Error al guardar");
        } finally {
            setSaving(false);
        }
    };

    const porcentaje = stats.logrosTotales > 0 
        ? Math.round((stats.logrosObtenidos / stats.logrosTotales) * 100) 
        : 0;

    const isTotalEditable = !totalLogrosReales || totalLogrosReales === 0;

    if (loading) return <div className="text-gray-500 text-sm">Cargando tus datos...</div>;

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mt-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="text-purple-500" /> Tu Progreso
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Estado</label>
                        <select 
                            name="estado" 
                            value={stats.estado}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-purple-500 outline-none"
                        >
                            <option value="Pendiente">📅 Pendiente</option>
                            <option value="Jugando">🎮 Jugando</option>
                            <option value="Terminado">✅ Terminado</option>
                            <option value="Abandonado">❌ Abandonado</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block flex items-center gap-1">
                            <Clock size={12} /> Horas Jugadas
                        </label>
                        <input 
                            type="number" 
                            name="horasJugadas"
                            min="0"
                            value={stats.horasJugadas}
                            onChange={handleChange}
                            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:border-purple-500 outline-none"
                        />
                    </div>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/50">
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1">
                            <Trophy size={12} className="text-yellow-500" /> Logros
                        </label>
                        <span className="text-sm font-bold text-purple-400">{porcentaje}% Completado</span>
                    </div>
                    
                    <div className="w-full bg-gray-700 h-2 rounded-full mb-4 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-purple-600 to-pink-500 h-full transition-all duration-500" 
                            style={{ width: `${Math.min(porcentaje, 100)}%` }}
                        ></div>
                    </div>

                    <div className="flex items-center justify-center gap-3 text-sm">
                        <input 
                            type="number" 
                            name="logrosObtenidos"
                            min="0"
                            max={stats.logrosTotales}
                            value={stats.logrosObtenidos}
                            onChange={handleChange}
                            className="w-20 bg-gray-900 border border-gray-700 text-white text-center rounded py-1 focus:border-purple-500 outline-none"
                        />
                        
                        <span className="text-gray-500 font-medium">de</span>
                        
                        <div className="relative group">
                            <input 
                                type="number" 
                                name="logrosTotales"
                                min="1"
                                value={stats.logrosTotales}
                                onChange={handleChange}
                                readOnly={!isTotalEditable} 
                                className={`w-20 border text-center rounded py-1 outline-none transition-colors ${
                                    isTotalEditable 
                                        ? "bg-gray-800 border-purple-500/50 text-white cursor-text hover:bg-gray-700" 
                                        : "bg-gray-900 border-gray-800 text-gray-500 cursor-not-allowed" 
                                }`}
                                title={isTotalEditable ? "Este juego no tiene datos oficiales, puedes editar el total." : "Dato oficial de RAWG (Bloqueado)"}
                            />
                            
                            <div className="absolute -right-6 top-1.5 text-gray-600">
                                {isTotalEditable ? <Edit2 size={12} /> : <Lock size={12} />}
                            </div>
                        </div>

                        <span className="text-gray-500 ml-4">logros</span>
                    </div>
                    
                    {isTotalEditable && (
                        <p className="text-[10px] text-gray-500 text-center mt-2">
                            * Total editable porque no hay datos oficiales.
                        </p>
                    )}
                </div>

                <button 
                    type="submit" 
                    disabled={saving}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-lg flex justify-center items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? "Guardando..." : <><Save size={18} /> Actualizar Estadísticas</>}
                </button>
            </form>
        </div>
    );
};

export default UserStatsManager;