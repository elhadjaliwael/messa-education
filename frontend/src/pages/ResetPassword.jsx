import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { axiosPublic } from '../api/axios';

function ResetPassword() {
    const { userId, token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [isValidToken, setIsValidToken] = useState(null);
    const [resetSuccess, setResetSuccess] = useState(false);

    // Validate token on component mount
    useEffect(() => {
        const validateToken = async () => {
            try {
                await axiosPublic.get(`/auth/forgot-password/${userId}/${token}`);
                setIsValidToken(true);
            } catch (error) {
                setIsValidToken(false);
                toast.error('Invalid or expired reset link');
            }
        };

        if (userId && token) {
            validateToken();
        } else {
            setIsValidToken(false);
        }
    }, [userId, token]);

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 8) return 'Password must be at least 8 characters long';
        if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
        if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
        if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
        return '';
    };

    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword) return 'Please confirm your password';
        if (confirmPassword !== password) return 'Passwords do not match';
        return '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Real-time validation
        let error = '';
        if (name === 'password') {
            error = validatePassword(value);
            // Also revalidate confirm password if it exists
            if (formData.confirmPassword) {
                const confirmError = validateConfirmPassword(formData.confirmPassword, value);
                setFormErrors(prev => ({ ...prev, confirmPassword: confirmError }));
            }
        } else if (name === 'confirmPassword') {
            error = validateConfirmPassword(value, formData.password);
        }

        setFormErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const passwordError = validatePassword(formData.password);
        const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
        
        if (passwordError || confirmPasswordError) {
            setFormErrors({
                password: passwordError,
                confirmPassword: confirmPasswordError
            });
            return;
        }

        setIsSubmitting(true);
        setFormErrors({});

        try {
            await axiosPublic.post(`/auth/forgot-password/${userId}/${token}`, {
                password: formData.password
            });
            setResetSuccess(true);
            toast.success('Password reset successfully!');
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
            toast.error(errorMessage);
            console.error('Reset password error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading state while validating token
    if (isValidToken === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Validating reset link...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Invalid token state
    if (isValidToken === false) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-gray-900">Invalid Reset Link</CardTitle>
                        <CardDescription className="text-gray-600">
                            This password reset link is invalid or has expired.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 mb-4">
                                Please request a new password reset link.
                            </p>
                            <div className="space-y-2">
                                <Link to="/forgot-password">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        Request New Reset Link
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button variant="outline" className="w-full mt-4">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Login
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Toaster position="top-center" />
            </div>
        );
    }

    // Success state
    if (resetSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">Password Reset Successful!</CardTitle>
                        <CardDescription className="text-gray-600">
                            Your password has been successfully reset.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-sm text-gray-600 mb-4">
                            You will be redirected to the login page in a few seconds.
                        </p>
                        <Link to="/login">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                Go to Login
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
                <Toaster position="top-center" />
            </div>
        );
    }

    // Main reset password form
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900">Reset Your Password</CardTitle>
                    <CardDescription className="text-gray-600">
                        Enter your new password below
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your new password"
                                    className={`pr-10 ${formErrors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {formErrors.password && (
                                <p className="text-sm text-red-600">{formErrors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm your new password"
                                    className={`pr-10 ${formErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {formErrors.confirmPassword && (
                                <p className="text-sm text-red-600">{formErrors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Password Requirements */}
                        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
                            <p className="font-medium mb-1">Password must contain:</p>
                            <ul className="space-y-1">
                                <li className={`${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                                    • At least 8 characters
                                </li>
                                <li className={`${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : ''}`}>
                                    • One lowercase letter
                                </li>
                                <li className={`${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : ''}`}>
                                    • One uppercase letter
                                </li>
                                <li className={`${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : ''}`}>
                                    • One number
                                </li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <Button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Resetting Password...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </Button>

                        {/* Back to Login Link */}
                        <div className="text-center">
                            <Link 
                                to="/login" 
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <Toaster position="top-center" />
        </div>
    );
}

export default ResetPassword;