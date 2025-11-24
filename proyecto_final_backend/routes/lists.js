const express = require('express');
const router = express.Router();
const GameList = require('../models/GameList');
const { protect: verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, async (req, res) => {
    try {
        const { titulo, descripcion, publica } = req.body;
        
        const nuevaLista = new GameList({
            titulo,
            descripcion,
            publica,
            usuario: req.user.id,
            juegos: []
        });

        const listaGuardada = await nuevaLista.save();
        res.json(listaGuardada);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const listas = await GameList.find({ usuario: req.params.userId })
            .populate('juegos', 'titulo img')
            .sort({ fechaCreacion: -1 });
        res.json(listas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:listId/add', verifyToken, async (req, res) => {
    try {
        const { gameId } = req.body;
        const lista = await GameList.findOne({ _id: req.params.listId, usuario: req.user.id });
        if (!lista) return res.status(404).json({ message: "Lista no encontrada o no tienes permiso" });
        if (lista.juegos.includes(gameId)) {
            return res.status(400).json({ message: "El juego ya está en la lista" });
        }

        lista.juegos.push(gameId);
        await lista.save();
        
        res.json(lista);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:listId', verifyToken, async (req, res) => {
    try {
        await GameList.findOneAndDelete({ _id: req.params.listId, usuario: req.user.id });
        res.json({ message: "Lista eliminada" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;