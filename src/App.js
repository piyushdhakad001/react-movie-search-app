import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [movieName, setMovieName] = useState("");
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState("");

  // restore last search on page load
  useEffect(() => {
    const lastMovieName = localStorage.getItem("movie");
    const lastMovieDetails = localStorage.getItem("data");

    if (lastMovieName && lastMovieDetails) {
      setMovieName(lastMovieName);
      setMovieData(JSON.parse(lastMovieDetails));
    }
  }, []);

  const fetchData = async () => {
    const movie = movieName.trim();

    if (!movie) {
      setLoading("");
      alert("Enter movie name");
      return;
    }

    setLoading("Movie fetching.....");

    try {
      const url = `https://www.omdbapi.com/?t=${encodeURIComponent(movie)}&apikey=44fd002`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "False") {
        setLoading("");
        alert("Movie not found!");
        return;
      }

      localStorage.setItem("movie", movie);
      localStorage.setItem("data", JSON.stringify(data));

      setLoading("");
      setMovieData(data);
    } catch (err) {
      setLoading("Something went wrong. Check your connection.");
    }
  };

  const rating =
    movieData?.imdbRating && movieData.imdbRating !== "N/A"
      ? `${movieData.imdbRating}/10`
      : "Not rated";

  return (
    <div className="container">
      <div className="search-bar">
        <input
          type="text"
          className="input"
          placeholder="Enter movie name..."
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchData();
          }}
        />

        <button className="search" onClick={fetchData}>
          Search
        </button>
      </div>

      <div className="loading">{loading}</div>

      <div className="movie-container">
        {movieData && (
          <div>
            <p>
              {movieData.Title}, ({movieData.Year}) on IMDB
            </p>
            <p>☆ {rating}</p>
            <p>Duration..... {movieData.Runtime}</p>
            <p>Director..... {movieData.Director}</p>
            <p>Writer....... {movieData.Writer}</p>
            <p>Stars........ {movieData.Actors}</p>
            <p>Genre........ {movieData.Genre}</p>
            <p>Plot......... {movieData.Plot}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;