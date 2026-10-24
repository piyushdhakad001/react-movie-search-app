import { useEffect, useState } from "react";
import "./App.css";

import SearchBar from "./components/SearchBar";
import Tabs from "./components/Tabs";
import RecentSearches from "./components/RecentSearches";
import MovieGrid from "./components/MovieGrid";
import MovieDetails from "./components/MovieDetails";

const API = "https://react-movie-search-app-1d8b.onrender.com";

function App() {
  // ---------- STATE ----------
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState(
    JSON.parse(localStorage.getItem("recent") || "[]")
  );

  // ---------- LOAD FAVOURITES FROM SERVER (once) ----------
  useEffect(() => {
    fetch(API + "/api/favorites")
      .then((res) => res.json())
      .then((data) => setFavorites(data));
  }, []);

  // ---------- FAVOURITES ----------
  const isFavorite = (id) => favorites.some((m) => m.imdbID === id);

  const addFavorite = async (movie) => {
    const fav = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
    };
    fetch(API + "/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fav),
    });
    setFavorites([...favorites, fav]);
  };

  const removeFavorite = async (movie) => {
    fetch(`${API}/api/favorites/${movie.imdbID}`, { method: "DELETE" });
    setFavorites(favorites.filter((m) => m.imdbID !== movie.imdbID));
  };

  const toggleFavorite = (movie) => {
    if (isFavorite(movie.imdbID)) {
      removeFavorite(movie);
    } else {
      addFavorite(movie);
    }
  };

  // ---------- RECENT SEARCHES ----------
  const saveRecent = (term) => {
    const others = recent.filter((t) => t.toLowerCase() !== term.toLowerCase());
    const updated = [term, ...others].slice(0, 5);
    setRecent(updated);
    localStorage.setItem("recent", JSON.stringify(updated));
  };

  // ---------- SEARCH ----------
  const searchMovies = async (term) => {
    if (!term.trim()) {
      setError("Please enter a movie name.");
      return;
    }

    setLoading(true);
    setError("");
    setSelected(null);
    setShowFavorites(false);

    try {
      const res = await fetch(`${API}/api/search?q=${encodeURIComponent(term.trim())}`);
      const data = await res.json();

      if (data.Response === "False") {
        setResults([]);
        setError("No movies found. Try another title.");
      } else {
        setResults(data.Search);
        saveRecent(term.trim());
      }
    } catch {
      setError("Something went wrong. Is the server running?");
    }

    setLoading(false);
  };

  // ---------- MOVIE DETAILS ----------
  const selectMovie = async (imdbID) => {
    setDetailsLoading(true);
    setError("");

    try {
      const res = await	fetch(`${API}/api/movie/${imdbID}`);
      const data = await res.json();

      if (data.Response === "False") {
        setError("Could not load movie details.");
      } else {
        setSelected(data);
      }
    } catch {
      setError("Something went wrong. Is the server running?");
    }

    setDetailsLoading(false);
  };

  // ---------- HANDLERS ----------
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

  // ---------- UI ----------
  return (
    <div className="container">
      <header className="header">
        <h1>Movie Search</h1>
        <p>Search any movie and get its IMDb details instantly.</p>
      </header>

      <SearchBar
        query={query}
        setQuery={setQuery}
        onSubmit={handleSubmit}
        loading={loading}
      />

      <Tabs
        showFavorites={showFavorites}
        favoritesCount={favorites.length}
        onSwitch={switchTab}
      />

      {error && <p className="error">{error}</p>}

      {!showFavorites && (
        <RecentSearches recent={recent} onClick={handleRecentClick} />
      )}

      {(loading || detailsLoading) && (
        <p className="loading">{loading ? "Searching..." : "Loading details..."}</p>
      )}

      {selected && (
        <MovieDetails
          movie={selected}
          isFavorite={isFavorite(selected.imdbID)}
          onBack={() => setSelected(null)}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {!selected && showFavorites && favorites.length === 0 && (
        <p className="loading">No favourites yet. Tap 🤍 on a movie to add it.</p>
      )}

      {!selected && showFavorites && favorites.length > 0 && (
        <MovieGrid
          list={favorites}
          isFavorite={isFavorite}
          onSelect={selectMovie}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {!selected && !showFavorites && results.length > 0 && (
        <MovieGrid
          list={results}
          isFavorite={isFavorite}
          onSelect={selectMovie}
          onToggleFavorite={toggleFavorite}
        />
      )}

      <footer className="footer">Data provided by OMDb API</footer>
    </div>
  );
}

export default App;
