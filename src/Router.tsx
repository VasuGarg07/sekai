import { createBrowserRouter, Navigate } from "react-router";
import Layout from "./ui/Layout";
import Homepage from "./pages/Homepage/Homepage";
import AdvancedSearch from "./pages/AdvancedSearch/AdvancedSearch";
import AnimeDetail from "./pages/AnimeDetail/AnimeDetail";
import PagedResults from "./pages/PagedResults/PagedResults";
import LoginPage from "./pages/Login/LoginPage";
import Watchlist from "./pages/Watchlist/Watchlist";
import Settings from "./pages/Settings/Settings";

type PagedRouteConfig = {
    path: string;
    title: string;
    queryKey: string;
    sort: string[];
    status?: string;
};

const PAGED_ROUTES: PagedRouteConfig[] = [
    { path: 'recents',   title: 'Recently Released', queryKey: 'airingAnime',      sort: ['UPDATED_AT_DESC'],  status: 'RELEASING' },
    { path: 'top-airing', title: 'Top Airing',       queryKey: 'airingAnime',      sort: ['TRENDING_DESC'],    status: 'RELEASING' },
    { path: 'popular',   title: 'Most Popular',       queryKey: 'mostPopular',      sort: ['POPULARITY_DESC']                       },
    { path: 'favourite', title: 'Most Favourite',     queryKey: 'mostFavourite',    sort: ['FAVOURITES_DESC']                       },
    { path: 'completed', title: 'Latest Completed',   queryKey: 'latestCompleted',  sort: ['END_DATE_DESC'],    status: 'FINISHED'  },
];

const router = createBrowserRouter([
    { path: 'login', element: <LoginPage /> },
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true,          element: <Homepage /> },
            { path: 'settings',     element: <Settings /> },
            { path: 'watchlist',    element: <Watchlist /> },
            { path: 'explore',      element: <AdvancedSearch /> },
            { path: 'search',       element: <AdvancedSearch /> },
            { path: 'anime/:id',    element: <AnimeDetail /> },
            ...PAGED_ROUTES.map(({ path, ...props }) => ({
                path,
                element: <PagedResults {...props} />
            })),
        ],
    },
    { path: '*', element: <Navigate to="/" replace /> },
]);

export default router;