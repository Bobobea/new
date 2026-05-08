import { useState, useEffect, useCallback } from 'react';
import { fetchEvents } from '../services/eventsApi';

export function useEvents({ position, radius, category, apiKey }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents({
        lat: position?.lat,
        lng: position?.lng,
        radius,
        category,
        apiKey,
      });
      setEvents(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [position?.lat, position?.lng, radius, category, apiKey]);

  useEffect(() => {
    load();
  }, [load]);

  return { events, loading, error, reload: load };
}
