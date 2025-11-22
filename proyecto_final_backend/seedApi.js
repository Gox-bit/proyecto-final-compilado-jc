const mongoose = require('mongoose');
const axios = require('axios');
const translate = require('translate-google');
const Game = require('./models/Game');


const MONGO_URI = "mongodb+srv://xavilesq_db_user:ChPR2YK68K3yds5@cluster0.om7bkcx.mongodb.net/miBaseDeDatos?retryWrites=true&w=majority&appName=Cluster0"; 
const RAWG_API_KEY = "efbb79fb9c73443fbcd9d7930f018859"; 

const IMAGENES_MANUALES = {
    "Soulcalibur (1998)": "https://m.media-amazon.com/images/M/MV5BODQwOGZmODEtNWEwYS00Y2QxLThiZTAtNGI4YjU0OTU0ZmE5XkEyXkFqcGc@._V1_.jpg",
    "Soulcalibur": "https://m.media-amazon.com/images/M/MV5BNGQ3ZjEwMmEtNzQ2Ny00NWEwLWI5ZDktMzU3YmNiYjU5NzU3XkEyXkFqcGc@._V1_.jpg",
};

const CANTIDAD_DESEADA = 200; 


const traducirGenero = (englishGenre) => {
    const mapa = {
        'Action': 'Acción', 'Adventure': 'Aventura', 'RPG': 'RPG', 'Strategy': 'Estrategia',
        'Shooter': 'Acción', 'Puzzle': 'Puzzle', 'Arcade': 'Arcade', 'Racing': 'Carreras',
        'Sports': 'Deportes', 'Fighting': 'Peleas', 'Family': 'Familiar', 'Simulation': 'Simulación'
    };
    return mapa[englishGenre] || 'Aventura';
};

const importarJuegosDesdeAPI = async () => {
    try {
        console.log('🔌 Conectando a MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Conectado.');

        const juegosProcesados = [];
        let paginaActual = 1;

        console.log(`🌍 Iniciando descarga y TRADUCCIÓN de juegos... (Esto tomará unos minutos)`);
        
        while (juegosProcesados.length < CANTIDAD_DESEADA) {
            const response = await axios.get(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=20&page=${paginaActual}&ordering=-metacritic`);
            const rawGames = response.data.results;

            if (!rawGames || rawGames.length === 0) break;

            for (const game of rawGames) {
                if (juegosProcesados.length >= CANTIDAD_DESEADA) break;

                try {

                    await new Promise(resolve => setTimeout(resolve, 2500)); 

                    const detailResponse = await axios.get(`https://api.rawg.io/api/games/${game.id}?key=${RAWG_API_KEY}`);
                    const descriptionEnglish = detailResponse.data.description_raw || "No description available.";

   
                    let descriptionSpanish = "Sin descripción.";
                    try {
                        descriptionSpanish = await translate(descriptionEnglish, { to: 'es' });
                    } catch (transError) {
                        console.error(`   ⚠️ Error traduciendo ${game.name}, se usará inglés.`);
                        descriptionSpanish = descriptionEnglish;
                    }

               
const descFinal = descriptionSpanish.length > 500 ? descriptionSpanish.slice(0, 500) + "..." : descriptionSpanish;


let imagenFinal = game.background_image;


if (!imagenFinal) {
    console.log(`   ⚠️ ¡Alerta! ${game.name} no tiene imagen en RAWG.`);
    

    if (IMAGENES_MANUALES[game.name]) {
        imagenFinal = IMAGENES_MANUALES[game.name];
        console.log(`   🖼️ -> Solucionado: Se aplicó imagen manual para "${game.name}".`);
    } else {
    
        console.log(`   😓 -> No hay imagen manual definida. Usando placeholder genérico.`);
        imagenFinal = "https://images.unsplash.com/photo-1511512578047-dfb367046420?fm=jpg&w=600&h=400&fit=crop";
    }
}


const nuevoJuego = {
    titulo: game.name,
    genero: traducirGenero(game.genres[0]?.name),
    año: new Date(game.released).getFullYear(),
    descripcion: descFinal,
    img: imagenFinal, 
    puntuacionPromedio: game.rating || 0,
    numReseñas: game.ratings_count || 0
};

juegosProcesados.push(nuevoJuego);
// ...
                    console.log(`   [${juegosProcesados.length}/${CANTIDAD_DESEADA}] ✅ Traducido y Procesado: ${game.name}`);

                } catch (err) {
                    console.error(`   ❌ Error procesando ${game.name}: ${err.message}`);
                }
            }
            paginaActual++;
        }

        console.log('🗑️  Borrando datos antiguos en inglés...');
        await Game.deleteMany();

        console.log('💾 Guardando juegos en español...');
        await Game.insertMany(juegosProcesados);

        console.log('🎉 ¡ÉXITO! Base de datos actualizada al ESPAÑOL.');
        process.exit();

    } catch (error) {
        console.error('❌ Error fatal:', error.message);
        process.exit(1);
    }
};

importarJuegosDesdeAPI();