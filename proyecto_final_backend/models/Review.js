const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  comentario: {
    type: String,
    required: [true, 'El comentario no puede estar vacío.'],
    trim: true,
    maxlength: [500, 'El comentario no puede exceder los 500 caracteres.']
  },
  puntuacion: {
    type: Number,
    required: [true, 'La puntuación es obligatoria.'],
    min: 1,
    max: 5
  },
  juego: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});


reviewSchema.statics.recalcularPromedio = async function(juegoId) {
  const stats = await this.aggregate([
    { $match: { juego: juegoId } },
    {
      $group: {
        _id: '$juego',
        numReseñas: { $sum: 1 },
        promedio: { $avg: '$puntuacion' }
      }
    }
  ]);

  try {

    await this.model('Game').findByIdAndUpdate(juegoId, {
      puntuacionPromedio: stats[0] ? Math.round(stats[0].promedio * 10) / 10 : 0, 
      numReseñas: stats[0] ? stats[0].numReseñas : 0
    });
  } catch (err) {
    console.error(err);
  }
};

reviewSchema.post('save', function() {
  this.constructor.recalcularPromedio(this.juego);
});

reviewSchema.post('remove', function() {
  this.constructor.recalcularPromedio(this.juego);
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;