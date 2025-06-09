import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Trash2, User, Users } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { axiosPrivate } from '../api/axios';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';

const CompleteRegistration = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuth } = useAuth();
    
    // Get Google user data from navigation state
    const googleUserData = location.state || {};
    const { email = '', name = '', picture = '' } = googleUserData;
    
    const [selectedRole, setSelectedRole] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Student form data
    const [studentData, setStudentData] = useState({
        username: name || '',
        level: null
    });
    
    // Parent form data
    const [parentData, setParentData] = useState({
        username: name || '',
        children: []
    });
    
    // Education levels data
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
    
    // Add child to parent's children list
    const addChild = () => {
        setParentData(prev => ({
            ...prev,
            children: [...prev.children, { name: '', level: '' }]
        }));
    };
    
    // Remove child from parent's children list
    const removeChild = (index) => {
        setParentData(prev => ({
            ...prev,
            children: prev.children.filter((_, i) => i !== index)
        }));
    };
    
    // Update child data
    const updateChild = (index, field, value) => {
        setParentData(prev => ({
            ...prev,
            children: prev.children.map((child, i) => 
                i === index ? { ...child, [field]: value } : child
            )
        }));
    };
    
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            let registrationData = {
                email,
                username : name,
                role: selectedRole,
                level : null,
                children : [],
                isGoogleUser: true
            };
            
            if (selectedRole === 'student') {
                if (!studentData.username || !studentData.level) {
                    toast.error('Please fill in all required fields');
                    setIsLoading(false);
                    return;
                }
                registrationData = {
                    ...registrationData,
                    username: studentData.username,
                    level: studentData.level
                };
            } else if (selectedRole === 'parent') {
                if (!parentData.username) {
                    toast.error('Please fill in your username');
                    setIsLoading(false);
                    return;
                }
                registrationData = {
                    ...registrationData,
                    username: parentData.username,
                    children: parentData.children
                };
            }
            
            // Send registration data to backend
            const response = await axiosPrivate.post('/auth/complete-google-registration', registrationData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            
            if (response.status === 201) {
                toast.success('Registration completed successfully!');
                
                // Set auth state
                const { user, accessToken } = response.data;
                setAuth({ user, accessToken });
                
                // Redirect based on role
                setTimeout(() => {
                    if (selectedRole === 'student') {
                        navigate('/student', { replace: true });
                    } else if (selectedRole === 'parent') {
                        navigate('/parent', { replace: true });
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Toaster position="top-right" />
            
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Complete Your Registration
                    </h1>
                    <p className="text-gray-600">
                        Welcome {name}! Please complete your profile to get started.
                    </p>
                        <img 
                            src="https://github.com/shadcn.png" 
                            alt="Profile" 
                            className="w-16 h-16 rounded-full mx-auto mt-4 border-4 border-blue-100"
                        />
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Selection */}
                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-700">
                            I am a:
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setSelectedRole('student')}
                                className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                                    selectedRole === 'student'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <User className="w-8 h-8 mx-auto mb-2" />
                                <div className="font-medium">Student</div>
                                <div className="text-sm text-gray-500">I want to learn</div>
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => setSelectedRole('parent')}
                                className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                                    selectedRole === 'parent'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <Users className="w-8 h-8 mx-auto mb-2" />
                                <div className="font-medium">Parent</div>
                                <div className="text-sm text-gray-500">I have children</div>
                            </button>
                        </div>
                    </div>
                    
                    {/* Student Form */}
                    {selectedRole === 'student' && (
                        <div className="space-y-4 p-6 bg-blue-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900">Student Information</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username *
                                </label>
                                <Input
                                    type="text"
                                    value={studentData.username}
                                    onChange={(e) => setStudentData(prev => ({ ...prev, username: e.target.value }))}
                                    className="w-full"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Class Level *
                                </label>
                                <Select
                                    value={studentData.level}
                                    onValueChange={(value) => setStudentData(prev => ({ ...prev, level: value }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select your class level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {educationData.map((category) => (
                                            <SelectGroup key={category.label}>
                                                <SelectLabel>{category.label}</SelectLabel>
                                                {category.options.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    
                    {/* Parent Form */}
                    {selectedRole === 'parent' && (
                        <div className="space-y-4 p-6 bg-green-50 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-900">Parent Information</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username *
                                </label>
                                <Input
                                    type="text"
                                    value={parentData.username}
                                    onChange={(e) => setParentData(prev => ({ ...prev, username: e.target.value }))}
                                    className="w-full"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                            
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Children (Optional)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addChild}
                                        className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Child
                                    </button>
                                </div>
                                
                                {parentData.children.map((child, index) => (
                                    <div key={index} className="flex gap-3 mb-3 p-4 bg-white rounded-lg border">
                                        <div className="flex-1">
                                            <Input
                                                type="text"
                                                placeholder="Child's name"
                                                value={child.name}
                                                onChange={(e) => updateChild(index, 'name', e.target.value)}
                                                className="mb-2"
                                            />
                                            <Select
                                                value={child.level}
                                                onValueChange={(value) => updateChild(index, 'level', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select class level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {educationData.map((category) => (
                                                        <SelectGroup key={category.label}>
                                                            <SelectLabel>{category.label}</SelectLabel>
                                                            {category.options.map((option) => (
                                                                <SelectItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectGroup>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeChild(index)}
                                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                
                                {parentData.children.length === 0 && (
                                    <p className="text-sm text-gray-500 italic">
                                        No children added yet. You can add them later in your profile.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* Submit Button */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={!selectedRole || isLoading}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                                !selectedRole || isLoading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Completing Registration...
                                </div>
                            ) : (
                                'Complete Registration'
                            )}
                        </button>
                    </div>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Sign in here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CompleteRegistration;