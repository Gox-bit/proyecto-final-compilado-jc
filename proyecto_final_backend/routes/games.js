const express = require('express');
const router = express.Router();
const {
  getGames,
  createGame,
  updateGame,
  deleteGame,
  getGameById
} = require('../Controllers/GameController'); 
const reviewRoutes = require('./Review');

const { protect } = require('../middleware/authMiddleware');

router.use('/:gameId/reviews', reviewRoutes); 
router.route('/')
  .get(getGames)
  .post(protect, createGame); 

router.route('/:id')
  .get(getGameById)
  .put(protect, updateGame)
  .delete(protect, deleteGame); 

module.exports = router;