export default function Tabs({ showFavorites, favoritesCount, onSwitch }) {
  return (
    <div className="tabs">
      <button
        type="button"
        className={`tab ${!showFavorites ? "active" : ""}`}
        onClick={() => onSwitch(false)}
      >
        Search
      </button>
      <button
        type="button"
        className={`tab ${showFavorites ? "active" : ""}`}
        onClick={() => onSwitch(true)}
      >
        ❤️ Favourites ({favoritesCount})
      </button>
    </div>
  );
}