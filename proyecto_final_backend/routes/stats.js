const express = require('express');
const router = express.Router();
const UserGameStats = require('../models/UserGameStats');

const { protect: verifyToken } = require('../middleware/authMiddleware');
const User = require('../models/User');
router.get('/user/all', verifyToken, async (req, res) => {
    try {
        const stats = await UserGameStats.find({ user: req.user.id })
            .populate('game', 'titulo img genero año') 
            .sort({ fechaActualizacion: -1 });

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/public/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).select('username nombre name email role');
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const stats = await UserGameStats.find({ user: userId })
            .populate('game', 'titulo img genero año')
            .sort({ fechaActualizacion: -1 });

        res.json({
            userProfile: user, 
            stats: stats       
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:gameId', verifyToken, async (req, res) => {
    try {
        const stats = await UserGameStats.findOne({
            user: req.user.id,
            game: req.params.gameId
        });
        res.json(stats || {}); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { gameId, horasJugadas, logrosObtenidos, logrosTotales, estado } = req.body;

    try {
        const stats = await UserGameStats.findOneAndUpdate(
            { user: req.user.id, game: gameId },
            { 
                horasJugadas, 
                logrosObtenidos, 
                logrosTotales, 
                estado,
                fechaActualizacion: Date.now()
            },
            { new: true, upsert: true }
        );
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;