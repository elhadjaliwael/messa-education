import React, { useState } from 'react';
import { Link } from 'react-router';
import GoogleIcon from '../assets/google.png';
import toast, { Toaster } from 'react-hot-toast'; // Add this import
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth  from '../hooks/useAuth.jsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosPrivate } from '@/api/axios';
import { Input } from '@/components/ui/input';

function StudentSignUpForm() {
    const [formData, setFormData] = useState({ 
        username: '', 
        email: '', 
        password: '',
        level: '',
        role: "student" 
    });
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const { setAuth } = useAuth();
    // Fix the validation field name
    const validateField = (name, value) => {
        switch (name) {
            case 'username': 
                return !value ? 'Username is required' : value.length < 3 ? 'Username must be at least 3 characters' : '';
            case 'email':
                return !value ? 'Email is required' : !/\S+@\S+\.\S+/.test(value) ? 'Email is invalid' : '';
            case 'password':
                return !value ? 'Password is required' : value.length < 6 ? 'Password must be at least 6 characters' : '';
            case 'level':
                return !value? 'Class is required' : '';
            default:
                return '';
        }
    };
    const educationData = [
        {
            label: "Primary School (École Primaire)",
            options: [
                { value: "1ere_annee", label: "1ère Année" },
                { value: "2eme_annee", label: "2ème Année" },
                { value: "3eme_annee", label: "3ème Année" },
                { value: "4eme_annee", label: "4ème Année" },
                { value: "5eme_annee", label: "5ème Année" },
                { value: "6eme_annee", label: "6ème Année" },
            ]
        },
        {
            label: "Middle School (Collège)",
            options: [
                { value: "7eme_annee", label: "7ème Année" },
                { value: "8eme_annee", label: "8ème Année" },
                { value: "9eme_annee", label: "9ème Année" },
            ]
        },
        {
            label: "High School (Lycée)",
            options: [
                { value: "1ere_secondaire", label: "1ère Année Secondaire" },
                { value: "2eme_secondaire_sciences", label: "2ème Année Secondaire Sciences Expérimentales" },
                { value: "2eme_secondaire_eco", label: "2ème Année Secondaire Économie et Gestion" },
                { value: "2eme_secondaire_lettres", label: "2ème Année Secondaire Lettres" },
                { value: "2eme_secondaire_sport", label: "2ème Année Secondaire Sport" },
                { value: "3eme_secondaire_sciences", label: "3ème Année Secondaire Sciences Expérimentales" },
                { value: "3eme_secondaire_eco", label: "3ème Année Secondaire Économie et Gestion" },
                { value: "3eme_secondaire_lettres", label: "3ème Année Secondaire Lettres" },
                { value: "3eme_secondaire_sport", label: "3ème Année Secondaire Sport" },
                { value: "3eme_secondaire_info", label: "3ème Année - Informatique" },
                { value: "3eme_secondaire_technique", label: "3ème Année - Technique" },
                { value: "3eme_secondaire_math", label: "3ème Année - Mathématiques" },
                { value: "4eme_secondaire_math", label: "4ème Année - Mathématiques" },
                { value: "4eme_secondaire_sciences", label: "4ème Année - Sciences Expérimentales" },
                { value: "4eme_secondaire_technique", label: "4ème Année - Technique" },
                { value: "4eme_secondaire_eco", label: "4ème Année - Économie et Gestion" },
                { value: "4eme_secondaire_lettres", label: "4ème Année - Lettres" },
                { value: "4eme_secondaire_sport", label: "4ème Année - Sport" },
                { value: "4eme_secondaire_info", label: "4ème Année - Informatique" },
            ]
        }
    ];
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const handleChange = (e) => {
        const { name, value } = e.target || {};
        // If this is from the Select component (no event object with target)
        if (!e.target && name) {
            setFormData(prev => ({ ...prev, [name]: value }));
            setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
            return;
        }
        
        // Original handleChange logic for other inputs
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

    // Add loading state
    const [isLoading, setIsLoading] = useState(false);
    
    async function formAction(e) {
        e.preventDefault();
        setIsLoading(true); // Start loading
        
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false); // Stop loading
            return;
        }
    
        try {
            const res = await axiosPrivate.post('http://localhost:8000/api/auth/register', formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            
            if (res.status === 201) {
                if (res.data.requiresEmailVerification) {
                    toast.success('Registration successful! Please check your email to verify your account.');
                    navigate('/verify-email', { 
                        state: { email: formData.email },
                        replace: true 
                    });
                } else {
                    // Handle case where email verification is not required
                    toast.success('Registration successful!');
                    const user = res.data.user;
                    setAuth({ user, accessToken: res.data.accessToken });
                    if (from && from !== "/") {
                        redirectPath = from;
                    } else if (user?.role) {
                        // Role-based routing
                        console.log("wael")
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
                        redirectPath = '/signup';
                    }
                    
                    // Navigate after a short delay to ensure toast is visible
                    setTimeout(() => {
                        navigate(redirectPath, { replace: true });
                    }, 500);
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Signup failed');
        }
    }
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8000/api/auth/google';
    };
    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 0:
                return 'bg-red-500';
            case 1:
                return 'bg-yellow-500';
            case 2:
                return 'bg-green-500';
            case 3:
                return 'bg-blue-500';
            case 4:
                return 'bg-purple-500';
            default:
                return 'bg-gray-500'; 
        } 
    }
    return (
        <div>
            <Toaster 
                position="top-center"
                toastOptions={{
                    duration: 1000,
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
                            background: '#fb5053',
                        },
                    },
                }}
            />
            <form onSubmit={formAction} className="flex flex-col gap-4">
                <div className='flex flex-col gap-1'>
                    <Input
                        className={`border-2 ${errors.username ? 'border-red-500' : 'border-border'} rounded-lg px-3 py-2 placeholder:text-muted-foreground placeholder:font-light caret-foreground text-foreground`}
                        placeholder='Name'
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    {errors.username && <p className='text-red-500 text-xs'>{errors.username}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                    <Input
                        className={`border-2 ${errors.email ? 'border-red-500' : 'border-border'} rounded-lg px-3 py-2 placeholder:text-muted-foreground placeholder:font-light caret-foreground text-foreground`}
                        placeholder='Email'
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className='text-red-500 text-xs'>{errors.email}</p>}
                </div>
                {/* Class selection using Shadcn UI Select */}
                <div className='flex flex-col gap-1'>
                    <Select 
                        name="class"
                        value={formData.level || ''} 
                        onValueChange={(value) => {
                            setFormData(prev => ({ ...prev, level: value }));
                            setErrors(prev => ({ ...prev, level: validateField('level', value) }));
                        }}
                    >
                        <SelectTrigger 
                            className={`w-full border-2 ${errors.level ? 'border-red-500' : 'border-border'} rounded-lg px-3 py-2 placeholder:text-muted-foreground placeholder:font-light caret-foreground text-foreground h-[40px] bg-background`}
                        >
                            <SelectValue placeholder="Select your class" className="text-muted-foreground font-light" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border rounded-xl shadow-md">
                            {educationData.map((group, groupIndex) => {
                                const isFirstGroup = groupIndex === 0;
                                const isMiddleGroup = groupIndex === 1;
                                const isLastGroup = groupIndex === 2;
                                
                                let groupColorClass = "";
                                if (isFirstGroup) groupColorClass = "text-[#4ade80] font-medium";
                                if (isMiddleGroup) groupColorClass = "text-[#f59e0b] font-medium";
                                if (isLastGroup) groupColorClass = "text-[#3b82f6] font-medium";
                                
                                return (
                                    <SelectGroup key={groupIndex} className={`px-1 py-1 ${!isFirstGroup ? "mt-2 pt-2 border-t border-border" : ""}`}>
                                        <SelectLabel className={groupColorClass}>{group.label}</SelectLabel>
                                        {group.options.map((option, optionIndex) => (
                                            <SelectItem 
                                                key={optionIndex} 
                                                value={option.value}
                                                className="rounded-lg my-1 text-foreground hover:bg-muted cursor-pointer"
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                );
                            })}
                        </SelectContent>
                    </Select>
                    {errors.class && <p className='text-red-500 text-xs'>{errors.level}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                    <div className='relative'>
                        <Input
                            className={`border-2 w-full ${errors.password ? 'border-red-500' : 'border-border'} rounded-lg px-3 py-2 placeholder:text-muted-foreground placeholder:font-light caret-foreground text-foreground`}
                            placeholder='Password'
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {errors.password && <p className='text-red-500 text-xs'>{errors.password}</p>}
                    {formData.password && (
                        <div className='mt-1'>
                            <div className='flex gap-1 h-1 mb-1'>
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 rounded-full ${i < passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'}`}
                                    />
                                ))}
                            </div>
                            <p className='text-xs text-gray-500'>
                                {passwordStrength === 0 && 'Very Weak'}
                                {passwordStrength === 1 && 'Weak'}
                                {passwordStrength === 2 && 'Medium'}
                                {passwordStrength === 3 && 'Strong'}
                                {passwordStrength === 4 && 'Very Strong'}
                            </p>
                        </div>
                    )}
                </div>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className={`cursor-pointer font-primary font-medium w-full h-[40px] rounded-lg mt-2 transition-all duration-200 ${
                        isLoading 
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Signing Up...</span>
                        </div>
                    ) : (
                        'Sign Up'
                    )}
                </button>
            </form>
            <div className='flex justify-center items-center'>
                <p className='font-primary text-foreground font-light'>Already have an account? <Link to="/login"><span className='text-primary cursor-pointer'>Login</span></Link></p>
            </div>
            <div className='flex justify-center items-center mt-2'>
                <div className='w-[40%] h-[1px] bg-border'></div>
                <p className='font-primary text-foreground font-light mx-2'>Or</p>
                <div className='w-[40%] h-[1px] bg-border'></div>
            </div>
            <button className='border-2 cursor-pointer border-border m-5 flex justify-center items-center text-foreground font-primary font-medium w-[90%] h-[40px] rounded-xl'>
                <div className='flex justify-center items-center cursor-pointer' onClick={handleGoogleLogin}>
                    <img src={GoogleIcon} alt="Google Icon" className='w-6 h-6' />
                    <p className='font-primary text-foreground font-medium mx-2'>Login with Google</p>
                </div>
            </button>
    </div>
  )
}

export default StudentSignUpForm