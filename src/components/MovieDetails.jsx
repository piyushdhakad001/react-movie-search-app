import { clean } from "../utils";

export default function MovieDetails({ movie, isFavorite, onBack, onToggleFavorite }) {
  const rating =
    movie.imdbRating && movie.imdbRating !== "N/A"
      ? `${movie.imdbRating}/10`
      : "Not rated";

  return (
    <>
      <button type="button" className="back-button" onClick={onBack}>
        ← Back
      </button>

      <div className="movie-container">
        <div className="poster-section">
          {movie.Poster && movie.Poster !== "N/A" ? (
            <img src={movie.Poster} alt={`${movie.Title} poster`} className="poster" />
          ) : (
            <div className="poster-fallback">No poster available</div>
          )}
        </div>

        <div className="details-section">
          <h2>
            {movie.Title} ({movie.Year})
          </h2>
          <div className="badges">
            <span className="badge rating">⭐ {rating}</span>
            <span className="badge">{clean(movie.Rated)}</span>
            <span className="badge">{clean(movie.Runtime)}</span>
          </div>
          <p><strong>Genre:</strong> {clean(movie.Genre)}</p>
          <p><strong>Director:</strong> {clean(movie.Director)}</p>
          <p><strong>Writer:</strong> {clean(movie.Writer)}</p>
          <p><strong>Stars:</strong> {clean(movie.Actors)}</p>
          <p><strong>Plot:</strong> {clean(movie.Plot)}</p>

          <button type="button" className="fav-button" onClick={() => onToggleFavorite(movie)}>
            {isFavorite ? "❤️ Remove from favourites" : "🤍 Add to favourites"}
          </button>
        </div>
      </div>
    </>
  );
}