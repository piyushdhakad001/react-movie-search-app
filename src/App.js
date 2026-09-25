import { useState } from "react";
import "./App.css";

function App() {
  const [movieName, setMovieName] = useState("");
  const [movieData, setMovieData] = useState(null);

  const getMovieInfo = async (movieName) => {
    const response = await fetch(
      `http://www.omdbapi.com/?t=${movieName}&apikey=44fd002`
    );

    const data = await response.json();

    console.log(data);
    setMovieData(data);
  };

  const handleClick = () => {
    console.log(movieName);
    getMovieInfo(movieName);
  };

  return (
    <div className="container">
      <div className="search-bar">
        <input
          type="text"
          className="input"
          placeholder="Enter movie name"
          value={movieName}
          onChange={(e) => setMovieName(e.target.value)}
        />

        <button className="search" onClick={handleClick}>
          Search
        </button>
      </div>

      <div className="movieInfo">
        <p className="name">
          {movieData?.Title}, {movieData?.Year}
        </p>

        <p className="rating">
          ☆ {movieData?.Ratings?.[0]?.Value}
        </p>

        <p className="director">
          {movieData?.Director}
        </p>

        <p className="writer">
          {movieData?.Writer}
        </p>

        <p className="stars">
          {movieData?.Actors}
        </p>

        <p className="genre">
          {movieData?.Genre}
        </p>

        <p className="plot">
          {movieData?.Plot}
        </p>
      </div>
    </div>
  );
}

export default App;