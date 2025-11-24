import api from './api';

export const getGames = async () => {
    try {
        const response = await api.get('/games');
        
        if (Array.isArray(response.data)) {
            return response.data;
        } else {
            console.error("ERROR: La respuesta no es un array.", response.data);
            return [];
        }
    } catch (error) {
        console.error("Error al llamar a la API (getGames):", error);
        throw error;
    }
};

export const getGameById = async (id) => {
    if (!id || id === 'undefined') return null;

    try {
        const response = await api.get(`/games/${id}`);
        if (response.data.titulo) return response.data;
        if (response.data.game) return response.data.game;
        if (response.data.data) return response.data.data;
        return response.data;
    } catch (error) {
        console.error("Error fetching game details:", error);
        throw error;
    }
};

export const createGame = async (gameData) => {
    try {
        const response = await api.post('/games', gameData);
        return response.data;
    } catch (error) {
        console.error("Error creando juego:", error);
        throw error;
    }
};

export const getMyGameStats = async (gameId) => {
    try {
        const response = await api.get(`/stats/${gameId}`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo stats:", error);
        return null;
    }
};

export const saveGameStats = async (statsData) => {
    try {
        const response = await api.post('/stats', statsData);
        return response.data;
    } catch (error) {
        console.error("Error guardando stats:", error);
        throw error;
    }
};

export const updateGame = async (id, gameData) => {
    try {
        const response = await api.put(`/games/${id}`, gameData);
        return response.data;
    } catch (error) {
        console.error("Error actualizando juego:", error);
        throw error;
    }
};

export const deleteGame = async (id) => {
    try {
        await api.delete(`/games/${id}`);
        return true;
    } catch (error) {
        console.error("Error eliminando juego:", error);
        throw error;
    }
};

export const getUserProfileStats = async () => {
    try {
        const response = await api.get('/stats/user/all');
        return response.data;
    } catch (error) {
        console.error("Error cargando perfil:", error);
        return [];
    }
};

export const getPublicProfileStats = async (userId) => {
    try {
        const response = await api.get(`/stats/public/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error cargando perfil público:", error);
        return [];
    }
};
