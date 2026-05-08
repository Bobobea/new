const OPENAGENDA_BASE = 'https://api.openagenda.com/v2';

const MUSIC_KW = ['musique', 'concert', 'festival', 'jazz', 'rock', 'electro', 'classique', 'opéra', 'chanson', 'rap', 'hip-hop'];
const SPORTS_KW = ['sport', 'course', 'marathon', 'tournoi', 'match', 'football', 'tennis', 'natation', 'cyclisme', 'randonnée', 'rugby'];
const ARTS_KW = ['théâtre', 'exposition', 'danse', 'cinéma', 'art', 'spectacle', 'cirque', 'performance', 'musée', 'comédie'];
const FAMILY_KW = ['famille', 'enfant', 'marché', 'fête', 'brocante', 'communauté', 'quartier', 'vide-grenier', 'atelier'];

const CATEGORY_SEARCH = {
  music: 'musique concert festival',
  sports: 'sport course tournoi',
  arts: 'théâtre exposition art danse',
  family: 'famille marché fête enfant',
};

const CATEGORY_MAP_MOCK = {
  all: '',
  music: 'Music',
  sports: 'Sports',
  arts: 'Arts & Theatre',
  family: 'Family',
};

function detectCategory(keywords) {
  if (!keywords?.length) return 'Autre';
  const kws = keywords.map((k) => k.toLowerCase());
  const has = (list) => list.some((k) => kws.some((kw) => kw.includes(k)));
  if (has(MUSIC_KW)) return 'Music';
  if (has(SPORTS_KW)) return 'Sports';
  if (has(ARTS_KW)) return 'Arts & Theatre';
  if (has(FAMILY_KW)) return 'Family';
  return 'Autre';
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

function mapOpenAgendaEvent(e, userLat, userLng) {
  const timing = e.timings?.[0];
  const dateObj = timing?.begin ? new Date(timing.begin) : null;
  const keywords = e.keywords?.fr ?? e.keywords?.en ?? [];
  const category = detectCategory(keywords);
  const lat = e.location?.latitude ? parseFloat(e.location.latitude) : null;
  const lng = e.location?.longitude ? parseFloat(e.location.longitude) : null;

  let image = null;
  if (e.image) {
    if (typeof e.image === 'string') image = e.image;
    else if (e.image.base && e.image.filename) image = `${e.image.base}${e.image.filename}`;
    else if (e.image.sizes?.medium?.url) image = e.image.sizes.medium.url;
  }

  return {
    id: String(e.uid),
    name: e.title?.fr ?? e.title?.en ?? 'Événement sans titre',
    date: dateObj ? dateObj.toISOString().split('T')[0] : null,
    time: dateObj ? dateObj.toTimeString().slice(0, 8) : null,
    venue: e.location?.name ?? 'Lieu inconnu',
    city: e.location?.city ?? '',
    lat,
    lng,
    image,
    url: e.canonicalUrl ?? '#',
    category,
    genre: keywords[0] ?? null,
    conditions: e.conditions?.fr ?? e.conditions?.en ?? null,
    priceMin: null,
    priceMax: null,
    currency: 'EUR',
    distance:
      userLat && userLng && lat && lng
        ? Math.round(haversineDistance(userLat, userLng, lat, lng) * 10) / 10
        : null,
  };
}

export async function fetchEvents({ lat, lng, radius = 30, category = 'all', apiKey }) {
  if (!apiKey) return fetchMockEvents({ lat, lng, radius, category });

  const params = new URLSearchParams({
    key: apiKey,
    size: 30,
    sort: 'timings.asc',
    'timings[gte]': new Date().toISOString(),
    lang: 'fr',
  });

  if (lat && lng) {
    params.append('latlon', `${lat},${lng}`);
    params.append('radius', radius);
  }

  if (category !== 'all' && CATEGORY_SEARCH[category]) {
    params.append('keyword', CATEGORY_SEARCH[category]);
  }

  const res = await fetch(`${OPENAGENDA_BASE}/events?${params}`);
  if (!res.ok) throw new Error(`OpenAgenda API error: ${res.status}`);

  const data = await res.json();
  if (!data.success) throw new Error('Erreur de réponse OpenAgenda');

  return (data.events ?? []).map((e) => mapOpenAgendaEvent(e, lat, lng));
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
      conditions: '25€ – 65€',
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
      conditions: '30€ – 150€',
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
      genre: 'Marché',
      conditions: 'Gratuit',
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
      genre: 'Théâtre',
      conditions: '40€ – 120€',
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
      genre: 'Électro',
      conditions: '15€ – 30€',
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
      conditions: '20€ – 80€',
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
      genre: 'Exposition',
      conditions: '12€ – 18€',
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
      genre: 'Fête',
      conditions: 'Gratuit',
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
      conditions: '45€ – 90€',
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
      genre: 'Course',
      conditions: '35€',
    },
  ];

  const categoryFilter = CATEGORY_MAP_MOCK[category];
  let filtered = categoryFilter ? all.filter((e) => e.category === categoryFilter) : all;

  if (lat && lng) {
    filtered = filtered.filter((e) => haversineDistance(lat, lng, e.lat, e.lng) <= radius);
  }

  return filtered.map((e) => ({
    ...e,
    distance: lat && lng ? Math.round(haversineDistance(lat, lng, e.lat, e.lng) * 10) / 10 : null,
  }));
}
