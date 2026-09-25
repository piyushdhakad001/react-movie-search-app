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
        <p>{movieData?.Title}</p>
      </div>
    </div>
  );
}

export default App;