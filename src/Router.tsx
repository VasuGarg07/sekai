import { createBrowserRouter } from "react-router";
import Layout from "./ui/Layout";
import Homepage from "./pages/Homepage/Homepage";
import AdvancedSearch from "./pages/AdvancedSearch/AdvancedSearch";
import AnimeDetail from "./pages/AnimeDetail/AnimeDetail";
import PagedResults from "./pages/PagedResults/PagedResults";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Homepage /> },
            { path: 'explore', element: <AdvancedSearch /> },
            { path: 'anime/:id', element: <AnimeDetail /> },
            {
                path: 'recents',
                element: <PagedResults
                    title="Recently Released"
                    queryKey="airingAnime"
                    sort={["UPDATED_AT_DESC"]}
                    status="RELEASING"
                />
            },
            {
                path: 'top-airing',
                element: <PagedResults
                    title="Top Airing"
                    queryKey="airingAnime"
                    sort={["TRENDING_DESC"]}
                    status="RELEASING"
                />
            },
            {
                path: 'popular',
                element: <PagedResults
                    title="Most Popular"
                    queryKey="mostPopular"
                    sort={["POPULARITY_DESC"]}
                />
            },
            {
                path: 'favourite',
                element: <PagedResults
                    title="Most Favourite"
                    queryKey="mostFavourite"
                    sort={["FAVOURITES_DESC"]}
                />
            },
            {
                path: 'completed',
                element: <PagedResults
                    title="Latest Completed"
                    queryKey="latestCompleted"
                    sort={["END_DATE_DESC"]}
                    status="FINISHED"
                />
            },
            {
                path: 'tv-series',
                element: <PagedResults
                    title="Latest Completed"
                    queryKey="latestCompleted"
                    sort={["END_DATE_DESC"]}
                    status="FINISHED"
                />
            },
            {
                path: 'completed',
                element: <PagedResults
                    title="Latest Completed"
                    queryKey="latestCompleted"
                    sort={["END_DATE_DESC"]}
                    status="FINISHED"
                />
            },
        ]
    }
])

export default router;