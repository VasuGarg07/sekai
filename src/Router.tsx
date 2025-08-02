import { createBrowserRouter } from "react-router";
import CurrentSeasonAnime from "./components/CurrentSeasonAnime";
import Layout from "./home/Layout";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { path: '', element: <CurrentSeasonAnime /> },
        ]
    }
])

export default router;