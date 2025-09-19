import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { fireAuth } from "../shared/firebase";
import { setUser } from "../store/slices/authSlice";
import { serializeUser } from "../shared/utilities";

export const useAuthListener = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth, (user) => {
            const userState = user ? serializeUser(user) : null;
            dispatch(setUser(userState));
        });
        return () => unsubscribe();
    }, [dispatch]);
}
