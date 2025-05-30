import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { axiosPublic } from '../api/axios';
import GoogleIcon from '../assets/google.png';
import toast, { Toaster } from 'react-hot-toast';
import useAuth from '../hooks/useAuth.jsx';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';

function LoginForm() {
    const { setAuth } = useAuth();
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const validateForm = (data) => {
        const errors = {};
        if (!data.email) errors.email = 'Email is required';
        if (!data.password) errors.password = 'Password is required';
        return errors;
    };
    
    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                if (!value) return 'Email is required';
                if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
                return '';
            case 'password':
                if (!value) return 'Password is required';
                if (value.length < 6) return 'Password must be at least 6 characters';
                return '';
            default:
                return '';
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setFormErrors(prev => ({ ...prev, [name]: error }));
    };

    async function formAction(formData) {
        try {
            setIsSubmitting(true);
            const data = Object.fromEntries(formData);
            const errors = validateForm(data);
            if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
                setIsSubmitting(false);
                return;
            }
            setFormErrors({});

            const res = await axiosPublic.post('/auth/login', data);
            const accessToken = res?.data?.accessToken;
            const user = res?.data?.user;
            
            // Update auth context
            setAuth({ user, accessToken });
            
            toast.success('Login successful!');
            
            // Determine redirect path based on user role
            let redirectPath;
            
            if (from && from !== "/") {
                redirectPath = from;
            } else if (user?.role) {
                // Role-based routing
                switch(user.role.toLowerCase()) {
                    case 'admin':
                        redirectPath = '/admin';
                        break;
                    case 'teacher':
                        redirectPath = '/teacher';
                        break;
                    case 'student':
                        redirectPath = '/student';
                        break;
                    default:
                        redirectPath = '/login';
                }
            } else {
                redirectPath = '/login';
            }
            
            // Navigate after a short delay to ensure toast is visible
            setTimeout(() => {
                navigate(redirectPath, { replace: true });
            }, 500);
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            toast.error(errorMessage);
            setError(errorMessage);
            console.error('Login error:', error);
        } finally {
            setIsSubmitting(false);
        }
    }
    
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8000/api/auth/google';
    };
    
    return (
        <div>
            <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                    success: {
                        style: {
                            background: 'green',
                        },
                    },
                    error: {
                        style: {
                            background: 'red',
                        },
                    },
                }}
            />
            <form action={formAction} className="flex flex-col gap-4">
                <div className='flex flex-col gap-1'>
                    <Input 
                        className={`border-2 ${formErrors.email ? 'border-red-500' : 'border-border'} rounded-lg px-3 py-2 placeholder:text-muted-foreground placeholder:font-light caret-foreground text-foreground`}
                        placeholder='Email' 
                        name="email"
                        onChange={handleChange} 
                        disabled={isSubmitting}
                    />
                    {formErrors.email && <p className='text-red-500 text-xs'>{formErrors.email}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                    <Input 
                        className={`border-2 ${formErrors.password ? 'border-red-500' : 'border-border'} rounded-lg px-3 py-2 placeholder:text-muted-foreground placeholder:font-light caret-foreground text-foreground`}
                        placeholder='Password' 
                        type="password" 
                        name="password"
                        onChange={handleChange} 
                        disabled={isSubmitting}
                    />
                    {formErrors.password && <p className='text-red-500 text-xs'>{formErrors.password}</p>}
                </div>
                <Button 
                    type="submit" 
                    className='cursor-pointer bg-primary text-primary-foreground font-primary font-medium text-lg w-full h-[40px] rounded-lg mt-2'
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
            </form>
            <div className='flex justify-center items-center mt-6'>
                <p className='font-primary text-foreground font-light'>Don't have an account? <Link to="/signup"><span className='text-primary cursor-pointer'>Sign up</span></Link></p>
            </div>
            <div className='flex justify-center items-center mt-2'>
                <div className='w-[40%] h-[1px] bg-border'></div>
                <p className='font-primary text-foreground font-light mx-2'>Or</p>
                <div className='w-[40%] h-[1px] bg-border'></div>
            </div>
            <button 
                onClick={handleGoogleLogin}
                type="button" 
                className='border-2 cursor-pointer border-border flex justify-center items-center text-foreground font-primary font-medium w-full h-[40px] rounded-lg mt-2'
                disabled={isSubmitting}
            >
                <div className='flex justify-center items-center'>
                    <img src={GoogleIcon} alt="Google Icon" className='w-6 h-6' />
                    <p className='font-primary text-foreground font-medium mx-2'>Login with Google</p>
                </div>
            </button>
        </div>
    );
}

export default LoginForm;