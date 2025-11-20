import api from './api';

export const getGames = async () => {
    try {
        const response = await api.get('/games');
        console.log("services/games.js - Respuesta completa de Axios:", response);
        console.log("services/games.js - Contenido de response.data:", response.data); 
        
        if (Array.isArray(response.data)) {
            console.log("services/games.js - response.data ES un array. Longitud:", response.data.length);
            return response.data;
        } else {
            console.error("services/games.js - ERROR: response.data NO ES UN ARRAY. Tipo:", typeof response.data, "Valor:", response.data);
            return [];
        }

    } catch (error) {
        console.error("services/games.js - Error al llamar a la API (getGames):", error);
        throw error;
    }
};

// ====================================================================
// *** ASEGÚRATE DE QUE getGameById ESTÉ AQUÍ Y ESTÉ EXPORTADO ***
// ====================================================================
export const getGameById = async (id) => {
    try {
        const response = await api.get(`/games/${id}`);
        console.log("services/games.js - getGameById - Respuesta:", response.data);
        return response.data.data; 
    } catch (error) {
        console.error(`services/games.js - Error al llamar a la API (getGameById) para ID ${id}:`, error);
        throw error;
    }
};