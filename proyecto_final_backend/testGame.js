require('dotenv').config();

const mongoose = require('mongoose');
const Game = require('./models/Game.js'); 

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);

  const juego = new Game({
    titulo: 'Test Game',
    genero: 'Aventura',
    plataforma: 'PC',
    horas: 10,
    estado: 'Jugando',
    reseña: 'Muy bueno',
    puntuacion: 8
  });

  await juego.save();
  console.log('Juego guardado:', juego);

  const juegos = await Game.find();
  console.log('Juegos en base de datos:', juegos);

  await mongoose.disconnect();
}

test().catch(console.error);
