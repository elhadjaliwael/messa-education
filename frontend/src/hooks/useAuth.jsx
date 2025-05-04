import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { axiosPublic, axiosPrivate } from '../api/axios';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);
    console.log(auth)
    // Function to refresh the token
    const refreshToken = useCallback(async () => {
        try {
            const response = await axiosPublic.post('/auth/refresh', {}, {
                withCredentials: true // Ensure cookies are sent with the request
            });
            
            if (response.data && response.data.accessToken) {
                return {
                    accessToken: response.data.accessToken,
                    user: response.data.user
                };
            }
            return null;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return null;
        }
    }, []);
    
    // Function to update auth state
    const updateAuth = useCallback((newAuthData) => {
        setAuth(newAuthData);
        
        if (newAuthData?.accessToken) {
            // Immediately set the Authorization header when auth is updated
            axiosPrivate.defaults.headers.common['Authorization'] = `Bearer ${newAuthData.accessToken}`
        } else {
            delete axiosPrivate.defaults.headers.common['Authorization'];
        }
    }, []);
    
    // Function to log out
    const logout = useCallback(async () => {
        try {
            await axiosPublic.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            updateAuth({});
        }
    }, [updateAuth]);
    
    // Check auth status on initial load
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                setLoading(true);
                const authData = await refreshToken();
                if (authData && authData.accessToken) {
                    console.log('Auth restored successfully', authData);
                    updateAuth(authData);
                } else {
                    console.log('No valid refresh token found');
                    updateAuth({});
                }
            } catch (error) {
                console.error('Auth verification failed:', error);
                updateAuth({});
            } finally {
                setLoading(false);
            }
        };
        
        verifyAuth();
    }, [refreshToken, updateAuth]);
    
    // Set up axios interceptor for token refresh
    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                // Always check if auth.accessToken exists and ensure header is set
                if (auth?.accessToken) {
                    config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );
        
        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const authData = await refreshToken();
                    
                    if (authData) {
                        updateAuth(authData);
                        
                        prevRequest.headers['Authorization'] = `Bearer ${authData.accessToken}`;
                        return axiosPrivate(prevRequest);
                    } else {
                        // If refresh fails, log out
                        logout();
                    }
                }
                
                return Promise.reject(error);
            }
        );
        
        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [auth, refreshToken, updateAuth, logout]);
    
    return (
        <AuthContext.Provider value={{ 
            auth, 
            setAuth: updateAuth, 
            loading, 
            logout,
            isAuthenticated: !!auth?.accessToken,
            user: auth?.user || null
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default function useAuth() {
    return useContext(AuthContext);
}