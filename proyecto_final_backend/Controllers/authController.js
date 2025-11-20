const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    // 1. DEBUG: Ver qué llega exactamente del frontend
    console.log("Cuerpo de la petición (req.body):", req.body);

    // 2. CORRECCIÓN DE NOMBRES
    // El frontend envía 'username', pero el backend usaba 'nombre'.
    // Aquí extraemos 'username' del body.
    const { username, email, password } = req.body;

    // Validación básica manual (por si acaso)
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Por favor rellena todos los campos' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // 3. CREACIÓN DEL USUARIO
    // Mapeamos 'username' (del front) al campo 'nombre' (de la BD)
    const user = await User.create({
      nombre: username, 
      email,
      password, 
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Datos de usuario inválidos' });
    }
  } catch (error) {
    // 4. LOG DEL ERROR: ¡Ahora sí veremos el error en la terminal!
    console.error("Error en registerUser:", error); 
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password'); 

    const isMatch = user && (await bcrypt.compare(password, user.password));

    if (isMatch) {
      res.json({
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Email o contraseña inválidos' });
    }
  } catch (error) {
    console.error("Error en loginUser:", error); // Agregamos log aquí también
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = { registerUser, loginUser };