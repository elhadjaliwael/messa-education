import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const ProtectedRoute = ({ allowedRoles }) => {
    const { auth, loading } = useAuth();
    const location = useLocation();
    
    // Show loading state while checking authentication
    if (loading) {
        return <div>Loading...</div>;
    }
    
    return (
        auth?.user && auth?.accessToken && allowedRoles?.includes(auth?.user?.role)
            ? <Outlet />
            : auth?.user
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
};