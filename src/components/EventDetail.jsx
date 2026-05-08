function formatDate(dateStr, timeStr) {
  if (!dateStr) return 'Date inconnue';
  const date = new Date(`${dateStr}T${timeStr ?? '00:00'}`);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: timeStr ? '2-digit' : undefined,
    minute: timeStr ? '2-digit' : undefined,
  });
}

function formatPrice(min, max, currency) {
  if (min === 0 && max === 0) return 'Gratuit';
  if (!min && !max) return 'Prix non communiqué';
  const fmt = (n) => `${n}${currency === 'EUR' ? '€' : currency}`;
  if (min === max) return fmt(min);
  return `${fmt(min)} – ${fmt(max)}`;
}

export function EventDetail({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        {event.image && (
          <img className="modal-img" src={event.image} alt={event.name} />
        )}
        <div className="modal-body">
          <span className="modal-category">{event.category}{event.genre ? ` · ${event.genre}` : ''}</span>
          <h2 className="modal-title">{event.name}</h2>
          <div className="modal-info">
            <div className="modal-info-row">
              <span>🗓️</span>
              <span>{formatDate(event.date, event.time)}</span>
            </div>
            <div className="modal-info-row">
              <span>📍</span>
              <span>{event.venue}{event.city ? `, ${event.city}` : ''}</span>
            </div>
            <div className="modal-info-row">
              <span>🎟️</span>
              <span>{formatPrice(event.priceMin, event.priceMax, event.currency)}</span>
            </div>
            {event.distance != null && (
              <div className="modal-info-row">
                <span>🚶</span>
                <span>{event.distance} km de vous</span>
              </div>
            )}
          </div>
          {event.url && event.url !== '#' && (
            <a className="modal-cta" href={event.url} target="_blank" rel="noopener noreferrer">
              Voir les billets
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
