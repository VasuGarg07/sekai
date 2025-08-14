import { createBrowserRouter } from "react-router";
import Layout from "./home/Layout";
import Homepage from "./pages/Homepage";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Homepage /> },
        ]
    }
])

export default router;