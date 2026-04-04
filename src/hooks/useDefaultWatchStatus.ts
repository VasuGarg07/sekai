import { useMutation } from "@tanstack/react-query";
import { setDefaultWatchStatus } from "../store/slices/preferencesSlice";
import { useAppDispatch, useAppSelector } from "../store/reduxHooks";
import type { WatchStatus } from "../shared/interfaces";
import { toastService } from "../ui/toastService";
import { updatePreferences } from "../shared/firestore";

export const useDefaultWatchStatus = () => {
    const uid = useAppSelector(state => state.auth.user?.uid);
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: async (newStatus: WatchStatus) => {
            if (!uid) return { success: false as const, reason: 'not-logged-in' as const };
            return updatePreferences(uid, { default_watch_status: newStatus });
        },
        onMutate: (newStatus) => {
            dispatch(setDefaultWatchStatus(newStatus));
        },
        onSuccess: (result, newStatus) => {
            if (result.success) {
                toastService.success(`Default watch status updated to ${newStatus}.`);
                return;
            }
            if (result.reason === 'not-logged-in') {
                toastService.info("Please login first.");
                return;
            }
            toastService.error("Failed to update default watch status.");
        },
        onError: () => {
            toastService.error("Failed to update default watch status.");
        },
    });
};