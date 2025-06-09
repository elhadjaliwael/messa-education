import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { axiosPrivate } from '../api/axios';

const AuthCallback = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get parameters from URL
                const params = new URLSearchParams(location.search);
                const token = params.get('token');
                const role = params.get('role');
                const isNewUser = params.get('isNewUser') === 'true';
                const email = params.get('email');
                const name = params.get('name');
                const picture = params.get('picture');
                
                if (isNewUser) {
                    // New user - redirect to complete registration page
                    navigate('/complete-registration', {
                        state: {
                            email: decodeURIComponent(email || ''),
                            name: decodeURIComponent(name || ''),
                            picture: decodeURIComponent(picture || '')
                        },
                        replace: true
                    });
                    return;
                }
                
                if (!token) {
                    console.error('No token found in callback URL');
                    navigate('/login');
                    return;
                }
                
                // Existing user - verify token and set auth
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
                } else if (role === 'parent')  {
                    navigate('/parent');
                }else{
                    navigate('/student');
                }
            } catch (error) {
                console.error('Auth callback error:', error);
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