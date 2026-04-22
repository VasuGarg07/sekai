import { useMutation } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../store/reduxHooks";
import { setTheme } from "../store/slices/preferencesSlice";
import { updatePreferences } from "../shared/firestore";
import { toastService } from "../ui/toastService";
import { applyThemeClass } from "../shared/utilities";

export const useTheme = () => {
    const uid = useAppSelector(state => state.auth.user?.uid);
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: async (newTheme: string) => {
            if (!uid) return { success: false as const, reason: 'not-logged-in' as const };
            return updatePreferences(uid, { app_theme: newTheme });
        },
        onMutate: (newTheme) => {
            dispatch(setTheme(newTheme));
            applyThemeClass(newTheme);
        },
        onSuccess: (result, newTheme) => {
            if (result.success) {
                toastService.success(`Theme changed to ${newTheme}.`);
                return;
            }
            if (result.reason === 'not-logged-in') {
                toastService.info("Please login first.");
                return;
            }
            toastService.error("Failed to update theme.");
        },
        onError: () => {
            toastService.error("Failed to update theme.");
        },
    });
};