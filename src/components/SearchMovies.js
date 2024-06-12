import React, { useState } from 'react';
import axios from 'axios';

const SearchMovies = () => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState('');

    const searchMovies = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=0603d4df389e281cd4338b1fb04ca1b5&query=${query}`);
            setMovies(res.data.results);
        } catch (err) {
            console.error(err);
        }
    };

    const saveMovie = async (movie) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/auth/save-movie', {
                movieId: movie.id,
                title: movie.title,
                posterPath: movie.poster_path
            }, {
                headers: { 'Authorization': token }
            });
            alert('Movie saved successfully');
        } catch (err) {
            console.error(err);
            alert('Error saving movie');
        }
    };

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

    return (
        <div className="container">
            <h2>Search Movies</h2>
            <div className="row">
                <div className="col-md-8">
                    <form onSubmit={searchMovies}>
                        <div className="form-group">
                            <label>Movie Title</label>
                            <input type="text" className="form-control" value={query} onChange={(e) => setQuery(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Search</button>
                    </form>
                    <div className="mt-4">
                        {movies.map(movie => (
                            <div key={movie.id} className="card mb-3" style={{ maxWidth: '540px' }}>
                                <div className="row no-gutters">
                                    <div className="col-md-4">
                                        {movie.poster_path ? (
                                            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} className="card-img" alt={movie.title} />
                                        ) : (
                                            <img src="https://via.placeholder.com/200" className="card-img" alt="No poster" />
                                        )}
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{movie.title}</h5>
                                            <button onClick={() => saveMovie(movie)} className="btn btn-primary mr-2">Save</button>
                                            <button onClick={() => showTrailer(movie.id)} className="btn btn-secondary">Show Trailer</button>
                                        </div>
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
    );
};

export default SearchMovies;
