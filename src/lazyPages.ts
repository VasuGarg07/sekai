import { lazy } from "react";

// Route-level code splitting. Kept out of Router.tsx so that file stays fast-refresh friendly.
export const Homepage = lazy(() => import("./pages/Homepage/Homepage"));
export const AdvancedSearch = lazy(() => import("./pages/AdvancedSearch/AdvancedSearch"));
export const AnimeDetail = lazy(() => import("./pages/AnimeDetail/AnimeDetail"));
export const GenrePage = lazy(() => import("./pages/Genre/GenrePage"));
export const PagedResults = lazy(() => import("./pages/PagedResults/PagedResults"));
export const LoginPage = lazy(() => import("./pages/Login/LoginPage"));
export const Watchlist = lazy(() => import("./pages/Watchlist/Watchlist"));
export const Settings = lazy(() => import("./pages/Settings/Settings"));
