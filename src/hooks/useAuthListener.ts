import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fireAuth } from "../shared/firebase";
import { fetchUserWatchList } from "../shared/firestore";
import { serializeUser } from "../shared/utilities";
import { setUser } from "../store/slices/authSlice";
import { clearWatchlist, setWatchlist } from "../store/slices/watchlistSlice";

export const useAuthListener = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, async (user) => {
            if (user) {
                // Set user in auth slice
                dispatch(setUser(serializeUser(user)));

                try {
                    // Fetch watchlist IDs once on login
                    const items = await fetchUserWatchList(user.uid);
                    dispatch(setWatchlist(items));
                } catch (err) {
                    console.error("Failed to fetch watchlist IDs:", err);
                    dispatch(setWatchlist([]));
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
