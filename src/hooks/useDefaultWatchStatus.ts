import { useMutation } from "@tanstack/react-query";
import { setDefaultWatchStatus } from "../store/slices/preferencesSlice";
import { useAppDispatch, useAppSelector } from "../store/reduxHooks";
import type { WatchStatus } from "../shared/interfaces";
import { toastService } from "../ui/toastService";
import { updatePreferences } from "../shared/firestore";

export const useDefaultWatchStatus = () => {
    const uid = useAppSelector(state => state.auth.user?.uid);
    const dispatch = useAppDispatch();

    // Define a mutation for updating Firestore
    return useMutation({
        mutationFn: async (newStatus: WatchStatus) => {
            if (!uid) {
                toastService.error("User ID is required.");
                return;
            }
            await updatePreferences(uid, { default_watch_status: newStatus });
            return newStatus;
        },
        onMutate: async (newStatus) => {
            dispatch(setDefaultWatchStatus(newStatus));
        },
        onError: (error) => {
            console.error(error);
            toastService.error("Failed to update default watch status",);
        },
        onSuccess: (newStatus) => {
            toastService.success(`Updated default watch status: ${newStatus}`);
        },
    });
};
