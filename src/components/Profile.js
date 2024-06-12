import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [savedMovies, setSavedMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('http://localhost:5000/api/auth/profile', {
                        headers: { 'Authorization': token }
                    });
                    setUser(res.data);
                } catch (err) {
                    console.error(err.response.data);
                }
            } else {
                navigate('/login');
            }
        };
        fetchProfile();
    }, [navigate]);

    useEffect(() => {
        const fetchSavedMovies = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('http://localhost:5000/api/auth/saved-movies', {
                        headers: { 'Authorization': token }
                    });
                    setSavedMovies(res.data.sort((a, b) => b.rating - a.rating));
                } catch (err) {
                    console.error(err.response.data);
                }
            }
        };
        fetchSavedMovies();
    }, []);

    const showTrailer = async (movieId) => {
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=0603d4df389e281cd4338b1fb04ca1b5`);
            const trailer = res.data.results.find(video => video.type === 'Trailer');
            if (trailer) {
                setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
            } else {
                alert('Trailer not available');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deleteMovie = async (movieId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/auth/delete-movie/${movieId}`, {
                headers: { 'Authorization': token }
            });
            setSavedMovies(savedMovies.filter(movie => movie.movie_id !== movieId));
            alert('Movie deleted successfully');
        } catch (err) {
            console.error(err);
            alert('Error deleting movie');
        }
    };

    const updateRating = async (movieId, rating) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put('http://localhost:5000/api/auth/update-movie-rating', {
                movieId,
                rating
            }, {
                headers: { 'Authorization': token }
            });
            setSavedMovies(savedMovies.map(movie =>
                movie.movie_id === movieId ? { ...movie, rating } : movie
            ).sort((a, b) => b.rating - a.rating));
            alert('Rating updated successfully');
        } catch (err) {
            console.error(err);
            alert('Error updating rating');
        }
    };

    return (
        <div className="container">
            {user ? (
                <div>
                    <h2>{user.username}</h2>
                    <div className="row">
                        <div className="col-md-8">
                            <p>Email: {user.email}</p>
                            <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                            <h3>Saved Movies</h3>
                            <div className="row">
                                {savedMovies.map(movie => (
                                    <div key={movie.id} className="col-md-3 mb-4">
                                        <div className="card">
                                            {movie.poster_path ? (
                                                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} className="card-img-top" alt={movie.title} />
                                            ) : (
                                                <img src="https://via.placeholder.com/200" className="card-img-top" alt="No poster" />
                                            )}
                                            <div className="card-body">
                                                <h5 className="card-title">{movie.title}</h5>
                                                <div className="rating" style={{ fontSize: '1.5rem', color: '#ff66cc', textAlign: 'center' }}>
                                                    {movie.rating}/10
                                                </div>
                                                <div className="form-group">
                                                    <label>Update Rating</label>
                                                    <input type="number" className="form-control" min="1" max="10" defaultValue={movie.rating} onChange={(e) => updateRating(movie.movie_id, parseInt(e.target.value))} />
                                                </div>
                                                <button onClick={() => showTrailer(movie.movie_id)} className="btn btn-secondary mr-2">Show Trailer</button>
                                                <button onClick={() => deleteMovie(movie.movie_id)} className="btn btn-danger">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-md-4">
                            {trailerUrl && (
                                <div className="embed-responsive" style={{ paddingBottom: '112.5%', height: '0', position: 'relative' }}>
                                    <iframe className="embed-responsive-item" src={trailerUrl} allowFullScreen title="Trailer" style={{ width: '100%', height: '100%', position: 'absolute', top: '0', left: '0' }}></iframe>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Profile;
