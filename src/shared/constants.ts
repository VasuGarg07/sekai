import {
    // Building,
    Calendar,
    Clock,
    Film,
    // Grid3X3,
    TrendingUp
} from 'lucide-react';

export const navigationLinks = [
    { name: 'Recent', path: '/recent', icon: Clock },
    { name: 'Top Anime', path: '/top', icon: TrendingUp },
    { name: 'Seasonal', path: '/seasonal', icon: Calendar },
    { name: 'Movies', path: '/movies', icon: Film },
    // { name: 'Genres', path: '/genres', icon: Grid3X3 },
    // { name: 'Studios', path: '/studios', icon: Building }
];
