export default function SearchBar({ query, setQuery, onSubmit, loading }) {
  return (
    <form className="search-bar" onSubmit={onSubmit}>
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
  );
}