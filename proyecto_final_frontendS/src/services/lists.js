import api from './api';

export const getUserLists = async (userId) => {
    try {
        const response = await api.get(`/lists/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error cargando listas:", error);
        return [];
    }
};


export const createList = async (listData) => {
    try {
        const response = await api.post('/lists', listData);
        return response.data;
    } catch (error) {
        console.error("Error creando lista:", error);
        throw error;
    }
};


export const deleteList = async (listId) => {
    try {
        await api.delete(`/lists/${listId}`);
        return true;
    } catch (error) {
        console.error("Error borrando lista:", error);
        throw error;
    }
};

export const addGameToList = async (listId, gameId) => {
    try {
        const response = await api.put(`/lists/${listId}/add`, { gameId });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Error al añadir a la lista";
    }
};