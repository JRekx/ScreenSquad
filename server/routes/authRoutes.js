const express = require('express');
const { register, login, profile, saveMovie, getSavedMovies, deleteMovie, updateMovieRating } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, profile);
// add faves
router.post('/save-movie', authMiddleware, saveMovie);
router.get('/saved-movies', authMiddleware, getSavedMovies);
// delete fave
router.delete('/delete-movie/:movieId', authMiddleware, deleteMovie); 
// update rating
router.put('/update-movie-rating', authMiddleware, updateMovieRating);  



module.exports = router;
