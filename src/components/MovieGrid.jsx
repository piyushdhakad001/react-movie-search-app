import MovieCard from "./MovieCard";

export default function MovieGrid({ list, isFavorite, onSelect, onToggleFavorite }) {
  return (
    <div className="results-grid">
      {list.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          isFavorite={isFavorite(movie.imdbID)}
          onSelect={onSelect}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}