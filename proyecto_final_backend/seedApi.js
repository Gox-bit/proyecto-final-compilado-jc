const mongoose = require('mongoose');
const axios = require('axios');
const translate = require('translate-google'); 
const Game = require('./models/Game');

const MONGO_URI = "mongodb+srv://xavilesq_db_user:ChPR2YK68K3yds5@cluster0.om7bkcx.mongodb.net/miBaseDeDatos?retryWrites=true&w=majority&appName=Cluster0"; 
const RAWG_API_KEY = "efbb79fb9c73443fbcd9d7930f018859"; 

const CANTIDAD_DESEADA = 1000; 

const IMAGENES_MANUALES = {
    "Soulcalibur (1998)": "https://upload.wikimedia.org/wikipedia/en/8/8e/Soul_Calibur_DC_Cover.jpg",
    "Soulcalibur": "https://image.api.playstation.com/cdn/UP0700/CUSA12544_00/D0E2G1J1H8K9L6M5N4O3P2Q1R0S9T8U7V6W5X4Y3Z2.png",
};

const PALABRAS_PROHIBIDAS = [
    "dlc", "expansion", "expansión", "soundtrack", "bonus", "season pass", 
    "bundle", "pack", "artbook", "artwork", "deluxe", "definitive", "collector", 
    "director's cut", "goty", "game of the year", 
    "complete edition", "royal edition", "legendary edition", "anniversary",
    "episode", "episodio", "hearts of stone", "blood and wine", "wild hunt -", 
    "left behind", "burial at sea", "undead nightmare"
];

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
        const TIEMPO_ESPERA = 3500; 

        console.log(`🌍 Iniciando descarga con LÓGICA DE FILTRADO SEGURA...`);
        
        while (juegosProcesados.length < CANTIDAD_DESEADA) {
            try {
                console.log(`📄 Consultando página ${paginaActual}...`);
               const response = await axios.get(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&page_size=20&page=${paginaActual}&ordering=-metacritic&metacritic=80,100&dates=2000-01-01,2025-12-31`);
                const rawGames = response.data.results;

                if (!rawGames || rawGames.length === 0) break;

                for (const game of rawGames) {
                    if (juegosProcesados.length >= CANTIDAD_DESEADA) break;

                    const nombreNuevo = game.name;
                    const nombreNuevoLower = nombreNuevo.toLowerCase();

                    if (PALABRAS_PROHIBIDAS.some(p => nombreNuevoLower.includes(p))) {
                        console.log(`   🧹 Descartado (Basura/DLC): ${nombreNuevo}`);
                        continue;
                    }

                    const esRepetido = juegosProcesados.some(juegoGuardado => {
                        const nombreGuardado = juegoGuardado.titulo;
                        
                        if (nombreNuevo.startsWith(nombreGuardado)) {
                            const restoDelNombre = nombreNuevo.replace(nombreGuardado, "");
                            
                            const separadoresDeEdicion = [" -", " (", " Game of the", " GOTY", " Edition"];
                            
                            if (separadoresDeEdicion.some(sep => restoDelNombre.startsWith(sep))) {
                                return true; // Bloquea "The Witcher 3 - GOTY"
                            }
                        }
                        return false;
                    });

                    if (esRepetido) {
                        console.log(`   🔁 Descartado (Repetido): ${nombreNuevo}`);
                        continue;
                    }

                    let descripcionFinal = "Descripción no disponible.";
                    let imagenFinal = game.background_image;
                    let logrosFinales = 0;

                    try {
                        await new Promise(resolve => setTimeout(resolve, TIEMPO_ESPERA)); 

                        const detailResponse = await axios.get(`https://api.rawg.io/api/games/${game.id}?key=${RAWG_API_KEY}`);
                        const detail = detailResponse.data;

                        logrosFinales = detail.parent_achievements_count || detail.achievements_count || 0;
                        const descriptionEnglish = detail.description_raw || "";
                        
                        if (descriptionEnglish) {
                            try {
                                const traduccion = await translate(descriptionEnglish, { to: 'es' });
                                descripcionFinal = traduccion;
                            } catch (errTrad) {
                                descripcionFinal = descriptionEnglish;
                            }
                        }
                    } catch (errDetail) { }

                    if (descripcionFinal.length > 500) descripcionFinal = descripcionFinal.slice(0, 500) + "...";
                    if (!imagenFinal && IMAGENES_MANUALES[game.name]) imagenFinal = IMAGENES_MANUALES[game.name];
                    else if (!imagenFinal) imagenFinal = "https://images.unsplash.com/photo-1511512578047-dfb367046420?fm=jpg&w=600&h=400&fit=crop";

                    const nuevoJuego = {
                        titulo: game.name,
                        genero: traducirGenero(game.genres[0]?.name),
                        año: new Date(game.released).getFullYear(),
                        descripcion: descripcionFinal,
                        img: imagenFinal,
                        puntuacionPromedio: game.rating || 0,
                        numReseñas: game.ratings_count || 0,
                        totalLogros: logrosFinales
                    };

                    juegosProcesados.push(nuevoJuego);
                    console.log(`   [${juegosProcesados.length}/${CANTIDAD_DESEADA}] ✅ Guardado: ${game.name} (🏆 ${logrosFinales})`);
                }
                paginaActual++;

            } catch (errPage) {
                console.error(`❌ Error en pág ${paginaActual}. Saltando...`);
                await new Promise(resolve => setTimeout(resolve, 10000));
                paginaActual++; 
            }
        }

        console.log('🗑️  Limpiando BD antigua...');
        await Game.deleteMany();

        console.log(`💾 Guardando ${juegosProcesados.length} juegos...`);
        await Game.insertMany(juegosProcesados);

        console.log('🎉 ¡ÉXITO! Base de datos depurada y segura.');
        process.exit();

    } catch (error) {
        console.error('❌ Error fatal:', error.message);
        process.exit(1);
    }
};

importarJuegosDesdeAPI();



