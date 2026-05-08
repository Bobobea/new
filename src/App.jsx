import { useState } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { useEvents } from './hooks/useEvents';
import { FilterBar } from './components/FilterBar';
import { EventCard } from './components/EventCard';
import { EventMap } from './components/EventMap';
import { EventDetail } from './components/EventDetail';
import { SettingsPanel } from './components/SettingsPanel';
import './App.css';

export default function App() {
  const { position, loading: geoLoading, error: geoError, permission, request: requestGeo } = useGeolocation();
  const [category, setCategory] = useState('all');
  const [radius, setRadius] = useState(30);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('tm_api_key') ?? '');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [view, setView] = useState('list');

  const { events, loading: eventsLoading, error: eventsError } = useEvents({
    position,
    radius,
    category,
    apiKey,
  });

  const handleSaveKey = (key) => {
    setApiKey(key);
    if (key) localStorage.setItem('tm_api_key', key);
    else localStorage.removeItem('tm_api_key');
  };

  const isDemo = !apiKey;

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <span className="header-logo">📍</span>
          <div>
            <h1 className="header-title">Événements près de moi</h1>
            {isDemo && <span className="demo-badge">Mode démo</span>}
          </div>
        </div>
        <div className="header-right">
          {permission !== 'granted' && (
            <button className="btn btn--locate" onClick={requestGeo} disabled={geoLoading}>
              {geoLoading ? '⏳ Localisation…' : '📡 Me localiser'}
            </button>
          )}
          {permission === 'granted' && position && (
            <span className="location-ok">✅ Localisé</span>
          )}
          <button className="btn btn--icon" onClick={() => setShowSettings(true)} title="Paramètres">⚙️</button>
        </div>
      </header>

      {geoError && (
        <div className="banner banner--warn">
          ⚠️ {geoError} — Affichage en mode démo centré sur Paris.
        </div>
      )}

      <FilterBar
        active={category}
        onChange={setCategory}
        radius={radius}
        onRadiusChange={setRadius}
      />

      <div className="view-toggle">
        <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>
          ☰ Liste
        </button>
        <button className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}>
          🗺️ Carte
        </button>
      </div>

      <main className="main">
        {view === 'map' ? (
          <EventMap
            events={events}
            position={position}
            radius={radius}
            selectedEvent={selectedEvent}
            onSelectEvent={setSelectedEvent}
          />
        ) : (
          <div className="event-list-container">
            {eventsLoading && (
              <div className="state-msg">
                <span className="spinner" />
                Recherche des événements…
              </div>
            )}
            {eventsError && (
              <div className="state-msg state-msg--error">⚠️ {eventsError}</div>
            )}
            {!eventsLoading && !eventsError && events.length === 0 && (
              <div className="state-msg">
                Aucun événement trouvé dans ce rayon. Essayez d'augmenter le rayon de recherche.
              </div>
            )}
            <div className="event-grid">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  highlight={selectedEvent?.id === event.id}
                  onClick={() => setSelectedEvent(event)}
                />
              ))}
            </div>
            {!eventsLoading && events.length > 0 && (
              <p className="results-count">
                {events.length} événement{events.length > 1 ? 's' : ''} trouvé{events.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}
      </main>

      {selectedEvent && (
        <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {showSettings && (
        <SettingsPanel
          apiKey={apiKey}
          onSave={handleSaveKey}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
