const TICKETMASTER_BASE = 'https://app.ticketmaster.com/discovery/v2';

const CATEGORY_MAP = {
  all: '',
  music: 'Music',
  sports: 'Sports',
  arts: 'Arts & Theatre',
  family: 'Family',
};

export async function fetchEvents({ lat, lng, radius = 30, category = 'all', apiKey }) {
  if (!apiKey) return fetchMockEvents({ lat, lng, radius, category });

  const params = new URLSearchParams({
    apikey: apiKey,
    latlong: `${lat},${lng}`,
    radius,
    unit: 'km',
    size: 30,
    sort: 'date,asc',
  });

  if (CATEGORY_MAP[category]) {
    params.append('classificationName', CATEGORY_MAP[category]);
  }

  const res = await fetch(`${TICKETMASTER_BASE}/events.json?${params}`);
  if (!res.ok) throw new Error(`Ticketmaster API error: ${res.status}`);

  const data = await res.json();
  const events = data._embedded?.events ?? [];

  return events.map((e) => ({
    id: e.id,
    name: e.name,
    date: e.dates?.start?.localDate,
    time: e.dates?.start?.localTime,
    venue: e._embedded?.venues?.[0]?.name ?? 'Lieu inconnu',
    city: e._embedded?.venues?.[0]?.city?.name ?? '',
    lat: parseFloat(e._embedded?.venues?.[0]?.location?.latitude),
    lng: parseFloat(e._embedded?.venues?.[0]?.location?.longitude),
    image: e.images?.find((i) => i.ratio === '16_9' && i.width > 500)?.url ?? e.images?.[0]?.url,
    url: e.url,
    category: e.classifications?.[0]?.segment?.name ?? 'Autre',
    genre: e.classifications?.[0]?.genre?.name,
    priceMin: e.priceRanges?.[0]?.min,
    priceMax: e.priceRanges?.[0]?.max,
    currency: e.priceRanges?.[0]?.currency,
  }));
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function fetchMockEvents({ lat, lng, radius, category }) {
  const baseLat = lat ?? 48.8566;
  const baseLng = lng ?? 2.3522;

  const all = [
    {
      id: 'm1',
      name: 'Festival Jazz en Ville',
      date: '2026-05-15',
      time: '20:00:00',
      venue: 'Zénith de Paris',
      city: 'Paris',
      lat: baseLat + 0.02,
      lng: baseLng + 0.03,
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400',
      url: '#',
      category: 'Music',
      genre: 'Jazz',
      priceMin: 25,
      priceMax: 65,
      currency: 'EUR',
    },
    {
      id: 'm2',
      name: 'Match PSG – Marseille',
      date: '2026-05-18',
      time: '21:00:00',
      venue: 'Parc des Princes',
      city: 'Paris',
      lat: baseLat - 0.03,
      lng: baseLng - 0.05,
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400',
      url: '#',
      category: 'Sports',
      genre: 'Football',
      priceMin: 30,
      priceMax: 150,
      currency: 'EUR',
    },
    {
      id: 'm3',
      name: 'Marché des Créateurs',
      date: '2026-05-20',
      time: '10:00:00',
      venue: 'Place de la République',
      city: 'Paris',
      lat: baseLat + 0.01,
      lng: baseLng + 0.01,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
      url: '#',
      category: 'Family',
      genre: 'Community',
      priceMin: 0,
      priceMax: 0,
      currency: 'EUR',
    },
    {
      id: 'm4',
      name: 'Comédie Musicale – Les Misérables',
      date: '2026-05-22',
      time: '19:30:00',
      venue: 'Théâtre du Châtelet',
      city: 'Paris',
      lat: baseLat + 0.005,
      lng: baseLng - 0.01,
      image: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400',
      url: '#',
      category: 'Arts & Theatre',
      genre: 'Musical',
      priceMin: 40,
      priceMax: 120,
      currency: 'EUR',
    },
    {
      id: 'm5',
      name: 'Concert Électro – Modular Nights',
      date: '2026-05-24',
      time: '23:00:00',
      venue: 'Warehouse Bastille',
      city: 'Paris',
      lat: baseLat - 0.01,
      lng: baseLng + 0.04,
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
      url: '#',
      category: 'Music',
      genre: 'Electronic',
      priceMin: 15,
      priceMax: 30,
      currency: 'EUR',
    },
    {
      id: 'm6',
      name: 'Tournoi de Tennis Open',
      date: '2026-05-25',
      time: '09:00:00',
      venue: 'Roland Garros',
      city: 'Paris',
      lat: baseLat - 0.04,
      lng: baseLng - 0.04,
      image: 'https://images.unsplash.com/photo-1560012057-4372e14c5085?w=400',
      url: '#',
      category: 'Sports',
      genre: 'Tennis',
      priceMin: 20,
      priceMax: 80,
      currency: 'EUR',
    },
    {
      id: 'm7',
      name: 'Exposition – Lumières de Paris',
      date: '2026-05-28',
      time: '11:00:00',
      venue: 'Grand Palais',
      city: 'Paris',
      lat: baseLat + 0.03,
      lng: baseLng - 0.02,
      image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400',
      url: '#',
      category: 'Arts & Theatre',
      genre: 'Exhibition',
      priceMin: 12,
      priceMax: 18,
      currency: 'EUR',
    },
    {
      id: 'm8',
      name: 'Fête de Quartier – Belleville',
      date: '2026-06-01',
      time: '14:00:00',
      venue: 'Square des Couronnes',
      city: 'Paris',
      lat: baseLat + 0.04,
      lng: baseLng + 0.05,
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
      url: '#',
      category: 'Family',
      genre: 'Community',
      priceMin: 0,
      priceMax: 0,
      currency: 'EUR',
    },
    {
      id: 'm9',
      name: 'Rock en Seine – Édition Spéciale',
      date: '2026-06-05',
      time: '17:00:00',
      venue: 'Domaine National de Saint-Cloud',
      city: 'Saint-Cloud',
      lat: baseLat - 0.06,
      lng: baseLng - 0.08,
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
      url: '#',
      category: 'Music',
      genre: 'Rock',
      priceMin: 45,
      priceMax: 90,
      currency: 'EUR',
    },
    {
      id: 'm10',
      name: 'Semi-Marathon de Paris',
      date: '2026-06-07',
      time: '08:30:00',
      venue: 'Place de la Concorde',
      city: 'Paris',
      lat: baseLat + 0.008,
      lng: baseLng - 0.025,
      image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400',
      url: '#',
      category: 'Sports',
      genre: 'Running',
      priceMin: 35,
      priceMax: 35,
      currency: 'EUR',
    },
  ];

  const categoryFilter = CATEGORY_MAP[category];
  let filtered = categoryFilter
    ? all.filter((e) => e.category === categoryFilter)
    : all;

  if (lat && lng) {
    filtered = filtered.filter(
      (e) => haversineDistance(lat, lng, e.lat, e.lng) <= radius
    );
  }

  return filtered.map((e) => ({
    ...e,
    distance: lat && lng ? Math.round(haversineDistance(lat, lng, e.lat, e.lng) * 10) / 10 : null,
  }));
}
