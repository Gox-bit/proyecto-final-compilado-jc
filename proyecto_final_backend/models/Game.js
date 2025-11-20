const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  genero: {
    type: String,
    required: true,
    trim: true
  },
 
  año: {
    type: Number,
    required: true 
  },

  descripcion: {
    type: String,
    required: false
  },
  horas: {
    type: Number,
    required: false,
    default: 0
  },
  estado: {
    type: String,
    enum: ['Completado', 'Jugando', 'Pendiente'],
    required: false,
    default: 'Pendiente',
  },
  puntuacionPromedio: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  numReseñas: {
    type: Number,
    default: 0
  },

  img: { type: String },
}, { 
  timestamps: true 
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;