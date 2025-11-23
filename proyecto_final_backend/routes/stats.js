const express = require('express');
const router = express.Router();
const UserGameStats = require('../models/UserGameStats');
const verifyToken = require('../middleware/authMiddleware'); 

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