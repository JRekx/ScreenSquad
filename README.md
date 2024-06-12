# ScreenSquad

ScreenSquad is a web application that allows users to register, log in, and manage their favorite movies. Users can search for movies, watch trailers, save movies to their profile, rate their favorite movies, and view their movie collection sorted by rating.

## Features

- User Authentication: Register, login, and logout functionality.
- Movie Search: Search for movies using The Movie Database (TMDb) API.
- Watch Trailers: Watch movie trailers directly within the app.
- Save Movies: Save movies to your profile.
- Rate Movies: Rate your favorite movies from 1 to 10.
- Sort Movies: View your saved movies sorted by rating from highest to lowest.

## Technologies Used

- **Frontend:**
  - React
  - Bootstrap

- **Backend:**
  - Node.js
  - Express
  - PostgreSQL

## Installation

To get a local copy of the project up and running, follow these steps:

### Prerequisites

- Node.js and npm installed on your machine
- PostgreSQL installed and running
- Git installed on your machine

### Backend Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/ScreenSquad.git
    cd ScreenSquad
    ```

2. Navigate to the backend directory:

    ```bash
    cd user-auth-app
    ```

3. Install backend dependencies:

    ```bash
    npm install
    ```

4. Set up the PostgreSQL database and update `models/userModel.js` with your database credentials.

5. Run database migrations (create tables, etc.):

    ```sql
    -- Connect to your PostgreSQL database and run the following SQL commands
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE saved_movies (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        movie_id INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        poster_path VARCHAR(255),
        rating INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

6. Start the backend server:

    ```bash
    node server/server.js
    ```

### Frontend Setup

1. Navigate to the frontend directory:

    ```bash
    cd client
    ```

2. Install frontend dependencies:

    ```bash
    npm install
    ```

3. Start the frontend development server:

    ```bash
    npm start
    ```

4. Open your browser and go to `http://localhost:3000`.

## Usage

1. Register a new user account.
2. Log in with your account credentials.
3. Use the search functionality to find movies.
4. Watch trailers by clicking on the "Show Trailer" button.
5. Save movies to your profile by clicking on the "Save" button.
6. Rate your favorite movies and view your movie collection sorted by rating.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [The Movie Database (TMDb)](https://www.themoviedb.org/) for providing the movie data and API.
