const CATEGORIES = [
  { id: 'all', label: 'Tous', emoji: '🗂️' },
  { id: 'music', label: 'Musique', emoji: '🎵' },
  { id: 'sports', label: 'Sports', emoji: '⚽' },
  { id: 'arts', label: 'Arts & Culture', emoji: '🎭' },
  { id: 'family', label: 'Communauté', emoji: '🏘️' },
];

export function FilterBar({ active, onChange, radius, onRadiusChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`filter-btn ${active === cat.id ? 'active' : ''}`}
            onClick={() => onChange(cat.id)}
          >
            <span>{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>
      <div className="filter-radius">
        <label>
          Rayon : <strong>{radius} km</strong>
        </label>
        <input
          type="range"
          min={5}
          max={100}
          step={5}
          value={radius}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
