import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Mail, RefreshCw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { axiosPrivate } from '@/api/axios';
import useAuth from '../hooks/useAuth';

function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  
  const email = location.state?.email;


  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }

    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    // Timer for OTP expiration
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pastedData = value.slice(0, 6);
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);
      
      // Focus last filled input or next empty
      const nextIndex = Math.min(pastedData.length, 5);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axiosPrivate.post('/auth/verify-otp', {
        email,
        otp: otpString
      });
  
      if (response.status === 200) {
        toast.success('Email verified successfully!');
        
        // Set auth context with verified user and tokens
        setAuth({ 
          user: response.data.user, 
          accessToken: response.data.accessToken 
        });
        
        // Navigate based on user role
        setTimeout(() => {
          const userRole = response.data.user.role;
          switch(userRole.toLowerCase()) {
            case 'admin':
              navigate('/admin', { replace: true });
              break;
            case 'teacher':
              navigate('/teacher', { replace: true });
              break;
            case 'student':
              navigate('/student', { replace: true });
              break;
            case 'parent':
              navigate('/parent', { replace: true });
              break;
            default:
              navigate('/login', { replace: true });
          }
        }, 200);
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    
    try {
      const response = await axiosPrivate.post('/auth/resend-otp', {
        email
      });

      if (response.status === 200) {
        toast.success('New OTP sent to your email');
        setTimeLeft(600); // Reset timer
        setCanResend(false);
        setOtp(['', '', '', '', '', '']); // Clear current OTP
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden flex items-center justify-center">
      <Toaster position="top-center" />
      <Card className="w-[400px] rounded-2xl shadow-lg border border-border">
        <CardHeader>
          <div className="relative flex items-center justify-between mt-6 w-full min-h-[40px]">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-primary transition"
              onClick={() => navigate('/signup')}
              title="Back to Signup"
              type="button"
            >
              <ArrowLeft size={24} />
            </Button>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-max pointer-events-none">
              <h1 className="text-xl text-center text-primary font-primary font-bold">
                Verify Email
              </h1>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-gray-600">
              We've sent a 6-digit verification code to
            </p>
            <p className="font-semibold text-primary">{email}</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 focus:border-primary"
                  disabled={isLoading}
                />
              ))}
            </div>

            <Button
              onClick={handleVerifyOTP}
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </div>

          <div className="text-center space-y-2">
            {timeLeft > 0 ? (
              <p className="text-sm text-gray-600">
                Code expires in <span className="font-semibold text-primary">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <p className="text-sm text-red-600 font-semibold">
                Code has expired
              </p>
            )}
            
            <div>
              <Button
                variant="ghost"
                onClick={handleResendOTP}
                disabled={!canResend || isResending}
                className="text-sm"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Resend Code'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OTPVerification;