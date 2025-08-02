import {
    TrendingUp,
    Calendar,
    Film,
    Shuffle,
    Grid3X3,
    Building,
    Clock
} from 'lucide-react';

export const navigationLinks = [
    { name: 'Recent', path: '/recent', icon: Clock },
    { name: 'Top Anime', path: '/top', icon: TrendingUp },
    { name: 'Seasonal', path: '/seasonal', icon: Calendar },
    { name: 'Movies', path: '/movies', icon: Film },
    { name: 'Random', path: '/random', icon: Shuffle },
    { name: 'Genres', path: '/genres', icon: Grid3X3 },
    { name: 'Studios', path: '/studios', icon: Building }
];
