import { useEffect, useState } from "react";
import "./App.css";

const API_KEY = process.env.REACT_APP_OMDB_KEY;
const BASE_URL = "https://www.omdbapi.com/";

const clean = (value) => (value && value !== "N/A" ? value : "Not available");

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("recent")) ?? [];
    } catch {
      return [];
    }
  });
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites")) ?? [];
    } catch {
      return [];
    }
  });

  // Save favourites whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (id) => favorites.some((m) => m.imdbID === id);

  const toggleFavorite = (movie) => {
    if (isFavorite(movie.imdbID)) {
      setFavorites(favorites.filter((m) => m.imdbID !== movie.imdbID));
    } else {
      const { imdbID, Title, Year, Poster } = movie;
      setFavorites([...favorites, { imdbID, Title, Year, Poster }]);
    }
  };

  const saveRecent = (term) => {
    const updated = [
      term,
      ...recent.filter((item) => item.toLowerCase() !== term.toLowerCase()),
    ].slice(0, 5);
    setRecent(updated);
    localStorage.setItem("recent", JSON.stringify(updated));
  };

  const searchMovies = async (term) => {
    const q = term.trim();
    if (!q) {
      setError("Please enter a movie name.");
      return;
    }

    setLoading(true);
    setError("");
    setSelected(null);
    setShowFavorites(false);

    try {
      const res = await fetch(
        `${BASE_URL}?s=${encodeURIComponent(q)}&type=movie&apikey=${API_KEY}`
      );
      const data = await res.json();

      if (data.Response === "False") {
        setResults([]);
        setError(
          data.Error === "Too many results."
            ? "Too many results. Try a more specific title."
            : "No movies found. Try another title."
        );
        return;
      }

      setResults(data.Search);
      saveRecent(q);
    } catch {
      setError("Something went wrong. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const selectMovie = async (imdbID) => {
    setDetailsLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${BASE_URL}?i=${imdbID}&plot=full&apikey=${API_KEY}`
      );
      const data = await res.json();

      if (data.Response === "False") {
        setError("Could not load movie details.");
        return;
      }

      setSelected(data);
    } catch {
      setError("Something went wrong. Check your connection.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    searchMovies(query);
  };

  const handleRecentClick = (term) => {
    setQuery(term);
    searchMovies(term);
  };

  const switchTab = (favoritesTab) => {
    setShowFavorites(favoritesTab);
    setSelected(null);
    setError("");
  };

  const rating =
    selected?.imdbRating && selected.imdbRating !== "N/A"
      ? `${selected.imdbRating}/10`
      : "Not rated";

  // Reused for both search results and favourites
  const renderGrid = (list) => (
    <div className="results-grid">
      {list.map((movie) => (
        <div key={movie.imdbID} className="movie-card">
          <button
            type="button"
            className="card-button"
            onClick={() => selectMovie(movie.imdbID)}
          >
            {movie.Poster && movie.Poster !== "N/A" ? (
              <img
                src={movie.Poster}
                alt={`${movie.Title} poster`}
                className="card-poster"
              />
            ) : (
              <div className="card-poster card-poster-fallback">No poster</div>
            )}
            <div className="card-info">
              <p className="card-title">{movie.Title}</p>
              <p className="card-year">{movie.Year}</p>
            </div>
          </button>

          <button
            type="button"
            className="heart"
            aria-label="Toggle favourite"
            onClick={() => toggleFavorite(movie)}
          >
            {isFavorite(movie.imdbID) ? "❤️" : "🤍"}
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container">
      <header className="header">
        <h1>🎬 Movie Search</h1>
        <p>Search any movie and get its IMDb details instantly.</p>
      </header>

      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="search"
          className="input"
          placeholder="Enter movie name..."
          aria-label="Search movies"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search" type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="tabs">
        <button
          type="button"
          className={`tab ${!showFavorites ? "active" : ""}`}
          onClick={() => switchTab(false)}
        >
          Search
        </button>
        <button
          type="button"
          className={`tab ${showFavorites ? "active" : ""}`}
          onClick={() => switchTab(true)}
        >
          ❤️ Favourites ({favorites.length})
        </button>
      </div>

      {error && (
        <p className="error" aria-live="polite">
          {error}
        </p>
      )}

      {!showFavorites && recent.length > 0 && (
        <div className="recent">
          <p className="recent-title">Recent searches:</p>
          <div className="recent-buttons">
            {recent.map((term) => (
              <button
                key={term}
                type="button"
                className="recent-button"
                onClick={() => handleRecentClick(term)}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {(loading || detailsLoading) && (
        <p className="loading" aria-live="polite">
          {loading ? "Searching..." : "Loading details..."}
        </p>
      )}

      {/* DETAILS VIEW */}
      {selected && (
        <>
          <button
            type="button"
            className="back-button"
            onClick={() => setSelected(null)}
          >
            ← Back
          </button>

          <div className="movie-container">
            <div className="poster-section">
              {selected.Poster && selected.Poster !== "N/A" ? (
                <img
                  src={selected.Poster}
                  alt={`${selected.Title} poster`}
                  className="poster"
                />
              ) : (
                <div className="poster-fallback">No poster available</div>
              )}
            </div>

            <div className="details-section">
              <h2>
                {selected.Title} ({selected.Year})
              </h2>
              <div className="badges">
                <span className="badge rating">⭐ {rating}</span>
                <span className="badge">{clean(selected.Rated)}</span>
                <span className="badge">{clean(selected.Runtime)}</span>
              </div>
              <p><strong>Genre:</strong> {clean(selected.Genre)}</p>
              <p><strong>Director:</strong> {clean(selected.Director)}</p>
              <p><strong>Writer:</strong> {clean(selected.Writer)}</p>
              <p><strong>Stars:</strong> {clean(selected.Actors)}</p>
              <p><strong>Plot:</strong> {clean(selected.Plot)}</p>

              <button
                type="button"
                className="fav-button"
                onClick={() => toggleFavorite(selected)}
              >
                {isFavorite(selected.imdbID)
                  ? "❤️ Remove from favourites"
                  : "🤍 Add to favourites"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* LIST VIEW: favourites or search results */}
      {!selected && showFavorites && (
        favorites.length > 0 ? (
          renderGrid(favorites)
        ) : (
          <p className="loading">No favourites yet. Tap 🤍 on a movie to add it.</p>
        )
      )}

      {!selected && !showFavorites && results.length > 0 && renderGrid(results)}

      <footer className="footer">Data provided by OMDb API</footer>
    </div>
  );
}

export default App;