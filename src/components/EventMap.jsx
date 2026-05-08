import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix leaflet default icon path broken by bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const CATEGORY_ICONS = {
  Music: '🎵',
  Sports: '⚽',
  'Arts & Theatre': '🎭',
  Family: '🏘️',
  Autre: '📌',
};

function createEventIcon(category) {
  const emoji = CATEGORY_ICONS[category] ?? CATEGORY_ICONS.Autre;
  return L.divIcon({
    html: `<div class="map-pin">${emoji}</div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
}

function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo([position.lat, position.lng], 13, { duration: 1.2 });
  }, [position, map]);
  return null;
}

export function EventMap({ events, position, radius, selectedEvent, onSelectEvent }) {
  const center = position
    ? [position.lat, position.lng]
    : [48.8566, 2.3522];

  return (
    <MapContainer center={center} zoom={12} className="event-map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {position && (
        <>
          <FlyTo position={position} />
          <Marker
            position={[position.lat, position.lng]}
            icon={L.divIcon({
              html: '<div class="map-pin map-pin--me">Moi</div>',
              className: '',
              iconSize: [44, 36],
              iconAnchor: [22, 18],
            })}
          >
            <Popup>Vous êtes ici</Popup>
          </Marker>
          <Circle
            center={[position.lat, position.lng]}
            radius={radius * 1000}
            pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.05, weight: 1.5 }}
          />
        </>
      )}

      {events.map((event) =>
        event.lat && event.lng ? (
          <Marker
            key={event.id}
            position={[event.lat, event.lng]}
            icon={createEventIcon(event.category)}
            eventHandlers={{ click: () => onSelectEvent(event) }}
          >
            <Popup>
              <strong>{event.name}</strong>
              <br />
              {event.venue}
              <br />
              {event.date}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}
