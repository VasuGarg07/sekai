// hooks/useTheme.ts
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
            if (!uid) {
                toastService.error("User ID is required.");
                return;
            }
            await updatePreferences(uid, { app_theme: newTheme });
            return newTheme;
        },
        onMutate: async (newTheme) => {
            dispatch(setTheme(newTheme));
            applyThemeClass(newTheme);
        },
        onError: (error) => {
            console.error(error);
            toastService.error("Failed to update theme.");
        },
        onSuccess: (newTheme) => {
            toastService.success(`Theme changed to ${newTheme}`);
        },
    });
};
