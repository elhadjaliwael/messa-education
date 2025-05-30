import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { axiosPrivate } from '../api/axios'; // Import your axios instance

const AuthCallback = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get token and role from URL parameters
                const params = new URLSearchParams(location.search);
                const token = params.get('token');
                const role = params.get('role');
                
                if (!token) {
                    console.error('No token found in callback URL');
                    navigate('/login');
                    return;
                }
                
                // Use your axios instance with proper configuration
                const response = await axiosPrivate.get('/auth/verify', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                console.log('Verification response:', response.data);
                
                // Set auth state with user data and token
                setAuth({
                    accessToken: token,
                    user: response.data.user
                });
                
                // Redirect based on user role
                if (role === 'admin') {
                    navigate('/admin');
                } else if (role === 'teacher') {
                    navigate('/teacher');
                } else {
                    // Default for students or other roles
                    navigate('/student');
                }
            } catch (error) {
                console.error('Auth callback error:', error);
                // Log more details about the error
                if (error.response) {
                    console.error('Error response:', error.response.status, error.response.data);
                }
                navigate('/login');
            }
        };
        
        handleCallback();
    }, [location, navigate, setAuth]);
    
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Authenticating...</h2>
                <p>Please wait while we complete your sign-in.</p>
            </div>
        </div>
    );
};

export default AuthCallback;