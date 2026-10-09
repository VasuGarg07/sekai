import { useMutation } from "@tanstack/react-query";
import { updatePreferences } from "../shared/firestore";
import type { UserPreferences } from "../shared/interfaces";
import { applyThemeClass } from "../shared/utilities";
import { useAppDispatch, useAppSelector } from "../store/reduxHooks";
import { applyPreferences } from "../store/slices/preferencesSlice";
import { toastService } from "../ui/toastService";

type EditablePreferences = Omit<UserPreferences, "lastSyncedAt">;
type PreferenceUpdates = Partial<EditablePreferences>;

interface UpdateMessages {
    success: string;
    error: string;
}

const applyLocally = (dispatch: ReturnType<typeof useAppDispatch>, values: PreferenceUpdates) => {
    dispatch(applyPreferences(values));
    if (values.app_theme) applyThemeClass(values.app_theme);
};

/**
 * Updates preferences optimistically: the UI changes immediately and is
 * rolled back to the previous values if the save to Firestore fails.
 */
export function useUpdatePreferences() {
    const uid = useAppSelector(state => state.auth.user?.uid);
    const preferences = useAppSelector(state => state.preferences);
    const dispatch = useAppDispatch();

    const mutation = useMutation({
        mutationFn: async ({ updates }: { updates: PreferenceUpdates; messages: UpdateMessages }) => {
            if (!uid) throw new Error("not-logged-in");
            const result = await updatePreferences(uid, updates);
            if (!result.success) throw result.error ?? new Error("save-failed");
        },
        onMutate: ({ updates }) => {
            const previous: PreferenceUpdates = {};
            for (const key of Object.keys(updates) as (keyof EditablePreferences)[]) {
                Object.assign(previous, { [key]: preferences[key] });
            }
            applyLocally(dispatch, updates);
            return { previous };
        },
        onSuccess: (_result, { messages }) => {
            toastService.success(messages.success);
        },
        onError: (_error, { messages }, context) => {
            if (context) applyLocally(dispatch, context.previous);
            toastService.error(messages.error);
        },
        retry: 0,
    });

    const update = (updates: PreferenceUpdates, messages: UpdateMessages) => {
        if (!uid) {
            toastService.info("Please login first.");
            return;
        }
        mutation.mutate({ updates, messages });
    };

    return { update, isPending: mutation.isPending };
}

/** 18+ Mode is only honoured for logged-in users; everyone else gets filtered results. */
export function useAdultMode(): boolean {
    return useAppSelector(state => !!state.auth.user && state.preferences.adult_mode);
}
