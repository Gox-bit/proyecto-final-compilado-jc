import React, { useEffect, useState } from 'react';
import { getGames } from './../services/games';
import GameCard from './../components/games/GameCard';

function HomePage() {
    const [games, setGames] = useState([]); // Inicializado como array vacío
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                console.log("HomePage.jsx - Iniciando fetchGames...");
                const data = await getGames();
                
                console.log("HomePage.jsx - Datos recibidos de getGames:", data);
                
                // Comprobación adicional antes de setGames
                if (Array.isArray(data)) {
                    console.log("HomePage.jsx - Data ES un array. Estableciendo estado 'games' con:", data);
                    setGames(data);
                } else {
                    console.error("HomePage.jsx - ERROR: Data NO ES UN ARRAY para setGames. Tipo:", typeof data, "Valor:", data);
                    setError('Los datos recibidos no tienen el formato esperado.');
                    setGames([]); // Asegurarse de que 'games' sea un array
                }
            } catch (err) {
                console.error("HomePage.jsx - Error en fetchGames catch block:", err);
                setError('Error al cargar los juegos: ' + (err.message || 'Error desconocido'));
            } finally {
                setLoading(false);
                console.log("HomePage.jsx - fetchGames finalizado. Estado 'loading' a false.");
            }
        };
        fetchGames();
    }, []);

    // Agrega un console.log para ver el estado 'games' en cada renderizado
    console.log("HomePage.jsx - Renderizando. Estado 'games':", games);
    console.log("HomePage.jsx - Renderizando. Estado 'loading':", loading);
    console.log("HomePage.jsx - Renderizando. Estado 'error':", error);


    if (loading) return <div>Cargando juegos...</div>;
    if (error) return <div>Error: {error}</div>;

    // Aquí es donde ocurre el error si 'games' no es un array
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Explora Juegos</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map(game => ( // Línea 32, donde ocurre el error
                    <GameCard key={game._id} game={game} />
                ))}
            </div>
        </div>
    );
}
export default HomePage;