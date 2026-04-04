import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { fireAuth } from "../shared/firebase";
import { registerProfile } from "../shared/firestore";
import { applyThemeClass, serializeUser } from "../shared/utilities";
import { setUser } from "../store/slices/authSlice";
import { resetPreferences, initPreferences } from "../store/slices/preferencesSlice";
import { toastService } from "../ui/toastService";
import { useAppDispatch } from "../store/reduxHooks";

export const useAuthListener = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, async (user) => {
            if (user) {
                // 1️⃣ Update auth state
                dispatch(setUser(serializeUser(user)));

                // 2️⃣ Register profile (no-op if already exists)
                const profileResult = await registerProfile(user);
                if (!profileResult.success) {
                    console.error("Failed to register profile:", profileResult.error);
                }

                // 3️⃣ Load user preferences
                try {
                    const { app_theme } = await dispatch(initPreferences(user.uid)).unwrap();
                    applyThemeClass(app_theme);
                } catch {
                    toastService.error("Failed to load preferences. Defaults will be used.");
                    applyThemeClass("rose");
                }

            } else {
                // 4️⃣ Clear all user data on logout
                dispatch(setUser(null));
                dispatch(resetPreferences());
                applyThemeClass("rose");
            }
        });

        return () => unsubscribe();
    }, [dispatch]);
};