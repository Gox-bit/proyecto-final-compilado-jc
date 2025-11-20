import api from './api';

export const getReviewsByGame = async (gameId) => {
    try {
        const response = await api.get(`/games/${gameId}/reviews`);
        
        console.log("🔍 DEBUG REVIEWS - Respuesta cruda de Axios:", response);
        console.log("📦 DEBUG REVIEWS - response.data:", response.data);

        // CASO 1: Estructura estandar { success: true, data: [...] }
        if (response.data && Array.isArray(response.data.data)) {
            console.log("✅ Estructura detectada: response.data.data");
            return response.data.data;
        }

        // CASO 2: La API devuelve el array directamente en response.data
        if (Array.isArray(response.data)) {
            console.log("✅ Estructura detectada: Array directo en response.data");
            return response.data;
        }
        
        // CASO 3: Quizás la propiedad se llama 'reviews' en lugar de 'data'
        if (response.data && Array.isArray(response.data.reviews)) {
            console.log("✅ Estructura detectada: response.data.reviews");
            return response.data.reviews;
        }

        console.warn("⚠️ No se encontró un array de reseñas válido. Devolviendo array vacío.");
        return [];

    } catch (error) {
        console.error("❌ Error en getReviewsByGame:", error);
        return []; // En caso de error, devolvemos array vacío para no romper la UI
    }
};

// ... Mantén el resto de funciones (createReview, updateReview, etc.) igual ...
export const createReview = async (gameId, reviewData) => {
    const response = await api.post(`/games/${gameId}/reviews`, reviewData);
    return response.data.data; // Ojo: Verifica si aquí también cambia la estructura
};

export const updateReview = async (reviewId, reviewData) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data.data;
};

export const deleteReview = async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
};