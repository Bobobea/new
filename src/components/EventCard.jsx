const CATEGORY_COLORS = {
  Music: '#7c3aed',
  Sports: '#059669',
  'Arts & Theatre': '#d97706',
  Family: '#2563eb',
  Autre: '#6b7280',
};

function formatDate(dateStr, timeStr) {
  if (!dateStr) return 'Date inconnue';
  const date = new Date(`${dateStr}T${timeStr ?? '00:00'}`);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: timeStr ? '2-digit' : undefined,
    minute: timeStr ? '2-digit' : undefined,
  });
}

function formatPrice(min, max, currency) {
  if (min === 0 && max === 0) return 'Gratuit';
  if (!min && !max) return null;
  const fmt = (n) => `${n}${currency === 'EUR' ? '€' : currency}`;
  if (min === max) return fmt(min);
  return `${fmt(min)} – ${fmt(max)}`;
}

export function EventCard({ event, onClick, highlight }) {
  const color = CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.Autre;
  const price = event.conditions ?? formatPrice(event.priceMin, event.priceMax, event.currency);

  return (
    <div
      className={`event-card ${highlight ? 'event-card--highlight' : ''}`}
      onClick={onClick}
      style={{ borderLeftColor: color }}
    >
      {event.image && (
        <img className="event-card__img" src={event.image} alt={event.name} loading="lazy" />
      )}
      <div className="event-card__body">
        <span className="event-card__badge" style={{ background: color }}>
          {event.category}
          {event.genre && event.genre !== event.category ? ` · ${event.genre}` : ''}
        </span>
        <h3 className="event-card__title">{event.name}</h3>
        <p className="event-card__date">{formatDate(event.date, event.time)}</p>
        <p className="event-card__venue">📍 {event.venue}{event.city ? `, ${event.city}` : ''}</p>
        <div className="event-card__footer">
          {price && <span className="event-card__price">{price}</span>}
          {event.distance != null && (
            <span className="event-card__distance">{event.distance} km</span>
          )}
        </div>
      </div>
    </div>
  );
}
