import { createBrowserRouter } from "react-router";
import Layout from "./ui/Layout";
import Homepage from "./pages/Homepage/Homepage";
import AdvancedSearch from "./pages/AdvancedSearch/AdvancedSearch";
import AnimeDetail from "./pages/AnimeDetail/AnimeDetail";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Homepage /> },
            { path: 'explore', element: <AdvancedSearch /> },
            { path: 'anime/:id', element: <AnimeDetail /> },
        ]
    }
])

export default router;