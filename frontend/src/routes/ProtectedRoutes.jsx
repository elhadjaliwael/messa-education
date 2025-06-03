import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const ProtectedRoute = ({ allowedRoles }) => {
    const { auth, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (auth?.user && auth?.accessToken) {
        return allowedRoles?.includes(auth.user.role)
            ? <Outlet />
            : <Navigate to="/unauthorized" replace />;
    }

    return <Navigate to="/login" replace />;
};
