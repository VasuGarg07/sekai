import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { fireAuth } from "../shared/firebase";
import { fetchUserWatchList } from "../shared/firestore";
import { applyThemeClass, serializeUser } from "../shared/utilities";
import { setUser } from "../store/slices/authSlice";
import { clearWatchlist, setWatchlist } from "../store/slices/watchlistSlice";
import { fetchPreferences, resetPreferences } from "../store/slices/preferencesSlice";
import { toastService } from "../ui/toastService";
import { useAppDispatch } from "../store/reduxHooks";

export const useAuthListener = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, async (user) => {
            if (user) {
                // 1️⃣ Update auth state
                dispatch(setUser(serializeUser(user)));

                // 2️⃣ Load user watchlist
                try {
                    const items = await fetchUserWatchList(user.uid);
                    dispatch(setWatchlist(items));
                } catch (err) {
                    console.error("Failed to fetch watchlist IDs:", err);
                    dispatch(setWatchlist([]));
                }

                // 3️⃣ Load user preferences
                try {
                    const { app_theme } = await dispatch(fetchPreferences(user.uid)).unwrap();
                    applyThemeClass(app_theme);
                } catch (err) {
                    console.error("Failed to fetch user preferences:", err);
                    toastService.error("Failed to load preferences. Defaults will be used.");
                }

            } else {
                // 4️⃣ Clear all user data on logout
                dispatch(setUser(null));
                dispatch(clearWatchlist());
                dispatch(resetPreferences());
                applyThemeClass("rose");
            }
        });

        return () => unsubscribe();
    }, [dispatch]);
};
