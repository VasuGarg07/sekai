import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../store/reduxHooks";
import LoadingState from "../ui/LoadingState";

/** Route guard: waits for Firebase to restore the session, then sends signed-out users to /login. */
const PrivateRoute = () => {
    const { user, initialized } = useAppSelector((state) => state.auth);
    const location = useLocation();

    if (!initialized) {
        return <LoadingState text="Checking your session..." />;
    }

    if (!user) {
        // Remember where the user was going so login can send them back
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default PrivateRoute;
