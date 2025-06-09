import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { axiosPublic } from '../api/axios';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const validateEmail = (email) => {
        if (!email) return 'Email is required';
        if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        const error = validateEmail(value);
        setFormErrors(prev => ({ ...prev, email: error }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const emailError = validateEmail(email);
        if (emailError) {
            setFormErrors({ email: emailError });
            return;
        }

        setIsSubmitting(true);
        setFormErrors({});

        try {
            // Replace with your actual API endpoint
            await axiosPublic.post('/auth/forgot-password', { email });
            setEmailSent(true);
            toast.success('Password reset email sent! Check your inbox.');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send reset email. Please try again.';
            toast.error(errorMessage);
            console.error('Forgot password error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
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
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-foreground">Check your email</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            We've sent a password reset link to <strong>{email}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground text-center">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>
                        <div className="flex flex-col gap-2">
                            <Button 
                                onClick={() => {
                                    setEmailSent(false);
                                    setEmail('');
                                }}
                                variant="outline" 
                                className="w-full"
                            >
                                Try again
                            </Button>
                            <Link to="/login">
                                <Button variant="ghost" className="w-full">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to login
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
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
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-foreground">Forgot your password?</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Enter your email address and we'll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={handleEmailChange}
                                disabled={isSubmitting}
                                className={`border-2 ${
                                    formErrors.email ? 'border-red-500' : 'border-border'
                                } rounded-lg px-3 py-2 placeholder:text-muted-foreground placeholder:font-light caret-foreground text-foreground`}
                            />
                            {formErrors.email && (
                                <p className="text-red-500 text-xs">{formErrors.email}</p>
                            )}
                        </div>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-primary text-primary-foreground font-medium text-lg h-[40px] rounded-lg"
                        >
                            {isSubmitting ? 'Sending...' : 'Send reset link'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link 
                            to="/login" 
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default ForgotPassword;