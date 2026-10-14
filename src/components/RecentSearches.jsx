export default function RecentSearches({ recent, onClick }) {
  if (recent.length === 0) return null;

  return (
    <div className="recent">
      <p className="recent-title">Recent searches:</p>
      <div className="recent-buttons">
        {recent.map((term) => (
          <button
            key={term}
            type="button"
            className="recent-button"
            onClick={() => onClick(term)}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}