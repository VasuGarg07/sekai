import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { fireAuth } from "../shared/firebase";
import { setUser } from "../store/slices/authSlice";
import { serializeUser } from "../shared/utilities";
import { fetchWatchlistIds } from "../shared/firestore";
import { clearWatchlist, setWatchlistIds } from "../store/slices/watchlistSlice";

export const useAuthListener = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, async (user) => {
            if (user) {
                // Set user in auth slice
                dispatch(setUser(serializeUser(user)));

                try {
                    // Fetch watchlist IDs once on login
                    const ids = await fetchWatchlistIds(user.uid);
                    dispatch(setWatchlistIds(ids));
                } catch (err) {
                    console.error("Failed to fetch watchlist IDs:", err);
                    dispatch(setWatchlistIds([]));
                }
            } else {
                // Clear user + watchlist on logout
                dispatch(setUser(null));
                dispatch(clearWatchlist());
            }
        });
        return () => unsubscribe();
    }, [dispatch]);
}
