const mongoose = require('mongoose');

const GameListSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    descripcion: {
        type: String,
        trim: true,
        maxLength: 200
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    juegos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    }],
    publica: {
        type: Boolean,
        default: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('GameList', GameListSchema);