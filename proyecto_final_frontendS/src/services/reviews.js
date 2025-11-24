import api from './api';

export const getReviewsByGame = async (gameId) => {
    try {
        const response = await api.get(`/games/${gameId}/reviews`);
        
        console.log("🔍 DEBUG REVIEWS - Respuesta cruda de Axios:", response);
        console.log("📦 DEBUG REVIEWS - response.data:", response.data);

        if (response.data && Array.isArray(response.data.data)) {
            console.log("✅ Estructura detectada: response.data.data");
            return response.data.data;
        }

        if (Array.isArray(response.data)) {
            console.log("✅ Estructura detectada: Array directo en response.data");
            return response.data;
        }
        
        if (response.data && Array.isArray(response.data.reviews)) {
            console.log("✅ Estructura detectada: response.data.reviews");
            return response.data.reviews;
        }

        console.warn("⚠️ No se encontró un array de reseñas válido. Devolviendo array vacío.");
        return [];

    } catch (error) {
        console.error("❌ Error en getReviewsByGame:", error);
        return []; 
    }
};

export const createReview = async (gameId, reviewData) => {
    const response = await api.post(`/games/${gameId}/reviews`, reviewData);
    return response.data.data; 
};

export const updateReview = async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data.data;
};

export const deleteReview = async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
};