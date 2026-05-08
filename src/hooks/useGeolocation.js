import { useState, useEffect } from 'react';

export function useGeolocation() {
  const [state, setState] = useState({
    loading: false,
    position: null,
    error: null,
    permission: 'idle', // idle | requesting | granted | denied
  });

  const request = () => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, error: 'Géolocalisation non supportée par ce navigateur.', permission: 'denied' }));
      return;
    }

    setState((s) => ({ ...s, loading: true, permission: 'requesting' }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          loading: false,
          position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          error: null,
          permission: 'granted',
        });
      },
      (err) => {
        const msg =
          err.code === 1
            ? 'Accès à la localisation refusé. Activez-la dans les paramètres du navigateur.'
            : 'Impossible de récupérer votre position.';
        setState({ loading: false, position: null, error: msg, permission: 'denied' });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return { ...state, request };
}
