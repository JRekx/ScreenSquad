const pool = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.profile = async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await pool.query('SELECT id, username, email, created_at FROM users WHERE id = $1', [userId]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Save movies



exports.deleteMovie = async (req, res) => {
    const userId = req.user.userId;
    const { movieId } = req.params;

    try {
        const result = await pool.query('DELETE FROM saved_movies WHERE user_id = $1 AND movie_id = $2 RETURNING *', [userId, movieId]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



exports.saveMovie = async (req, res) => {
    const userId = req.user.userId;
    const { movieId, title, posterPath, rating } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO saved_movies (user_id, movie_id, title, poster_path, rating) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, movieId, title, posterPath, rating || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getSavedMovies = async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await pool.query('SELECT * FROM saved_movies WHERE user_id = $1 ORDER BY rating DESC', [userId]);
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateMovieRating = async (req, res) => {
    const userId = req.user.userId;
    const { movieId, rating } = req.body;

    try {
        const result = await pool.query(
            'UPDATE saved_movies SET rating = $1 WHERE user_id = $2 AND movie_id = $3 RETURNING *',
            [rating, userId, movieId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
