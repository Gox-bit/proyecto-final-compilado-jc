const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  getReviewsForGame,
  createReview,
  updateReview,
  deleteReview
} = require('../Controllers/ReviewController');

const { protect } = require('../middleware/authMiddleware');

// Rutas /api/games/:gameId/reviews
router.route('/')
  .get(getReviewsForGame)
  .post(protect, createReview);

// Rutas /api/reviews/:reviewId
router.route('/:reviewId')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;