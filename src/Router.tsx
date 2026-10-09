import { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import PrivateRoute from "./components/PrivateRoute";
import {
    AdvancedSearch,
    AnimeDetail,
    GenrePage,
    Homepage,
    LoginPage,
    PagedResults,
    Settings,
    Watchlist,
} from "./lazyPages";
import Layout from "./ui/Layout";
import LoadingState from "./ui/LoadingState";

type PagedRouteConfig = {
    path: string;
    title: string;
    sort: string[];
    status?: string;
};

const PAGED_ROUTES: PagedRouteConfig[] = [
    { path: 'recents', title: 'Recently Released', sort: ['UPDATED_AT_DESC'], status: 'RELEASING' },
    { path: 'top-airing', title: 'Top Airing', sort: ['TRENDING_DESC'], status: 'RELEASING' },
    { path: 'popular', title: 'Most Popular', sort: ['POPULARITY_DESC'] },
    { path: 'favourite', title: 'Most Favourite', sort: ['FAVOURITES_DESC'] },
    { path: 'completed', title: 'Latest Completed', sort: ['END_DATE_DESC'], status: 'FINISHED' },
];

const router = createBrowserRouter([
    {
        path: 'login',
        element: (
            <Suspense fallback={<LoadingState />}>
                <LoginPage />
            </Suspense>
        ),
    },
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Homepage /> },
            { path: 'explore', element: <AdvancedSearch /> },
            { path: 'search', element: <AdvancedSearch /> },
            { path: 'anime/:id', element: <AnimeDetail /> },
            { path: 'genre/:genre', element: <GenrePage /> },
            // key = path so every list starts fresh (page, view mode) instead of reusing one instance
            ...PAGED_ROUTES.map(({ path, ...props }) => ({
                path,
                element: <PagedResults key={path} {...props} />,
            })),
            {
                element: <PrivateRoute />,
                children: [
                    { path: 'watchlist', element: <Watchlist /> },
                    { path: 'settings', element: <Settings /> },
                ],
            },
        ],
    },
    { path: '*', element: <Navigate to="/" replace /> },
]);

export default router;
