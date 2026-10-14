export default function MovieCard({ movie, isFavorite, onSelect, onToggleFavorite }) {
  return (
    <div className="movie-card">
      <button type="button" className="card-button" onClick={() => onSelect(movie.imdbID)}>
        {movie.Poster && movie.Poster !== "N/A" ? (
          <img src={movie.Poster} alt={`${movie.Title} poster`} className="card-poster" />
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
        onClick={() => onToggleFavorite(movie)}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </div>
  );
}