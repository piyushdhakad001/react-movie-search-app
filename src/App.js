import { useState } from "react";
import "./App.css";

function App() {
  const [movieName, setMovieName] = useState("");

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

        <button className="search">
          Search
        </button>
      </div>
    </div>
  );
}

export default App;