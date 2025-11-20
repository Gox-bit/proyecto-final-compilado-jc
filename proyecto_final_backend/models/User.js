const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'Por favor, añade un nombre']
  },
  email: {
    type: String,
    required: [true, 'Por favor, añade un email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, añade un email válido'
    ]
  },
  password: {
    type: String,
    required: [true, 'Por favor, añade una contraseña'],
    minlength: 6,
    select: false // Para que no se devuelva la contraseña en las consultas
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;