import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import type { RootState } from "../store/store";
import LoadingState from "../ui/LoadingState";

const PrivateRoute = () => {
    const { user, loading } = useSelector((state: RootState) => state.auth);

    if (loading) {
        return <LoadingState />; // Or a spinner
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;

}

export default PrivateRoute;