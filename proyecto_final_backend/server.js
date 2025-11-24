const express = require('express');
const cors = require('cors');
require('dotenv').config();
const gameRoutes = require("./routes/games");
const reviewRoutes = require('./routes/Review');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');
const statsRoutes = require('./routes/stats');
const app = express();


const allowedOrigins = [
  'http://localhost:5173',            
  'https://gox-bit.github.io'          
];

app.use(cors({
  origin: function (origin, callback) {
  
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
     
      var msg = 'La política CORS de este sitio no permite el acceso desde el origen especificado.';
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));
// -----------------------------------

app.use(express.json());
app.use("/api/games", gameRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando');
});
const listsRoutes = require('./routes/lists');

connectDB();

const PORT = process.env.PORT || 1578;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

app.use('/api/lists', listsRoutes);
module.exports = app;
