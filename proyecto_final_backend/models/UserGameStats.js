const mongoose = require('mongoose');

const UserGameStatsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    horasJugadas: {
        type: Number,
        default: 0
    },
    logrosObtenidos: {
        type: Number,
        default: 0
    },
    logrosTotales: {
        type: Number,
        default: 0 
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'Jugando', 'Terminado', 'Abandonado'],
        default: 'Jugando'
    },
    fechaActualizacion: {
        type: Date,
        default: Date.now
    }
});

UserGameStatsSchema.index({ user: 1, game: 1 }, { unique: true });

module.exports = mongoose.model('UserGameStats', UserGameStatsSchema);