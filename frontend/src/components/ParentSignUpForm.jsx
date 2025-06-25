import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.jsx';
import toast from 'react-hot-toast';
import { axiosPrivate } from '@/api/axios';

function ParentSignUpForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    level: '',
    role: 'parent',
    childrenIds: ['']
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { setAuth } = useAuth();

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        return !value ? 'Username is required' : value.length < 3 ? 'Username must be at least 3 characters' : '';
      case 'email':
        return !value ? 'Email is required' : !/\S+@\S+\.\S+/.test(value) ? 'Email is invalid' : '';
      case 'password':
        return !value ? 'Password is required' : value.length < 6 ? 'Password must be at least 6 characters' : '';
      case 'level':
        return ''; // Not required for parent, so always valid
      default:
        return '';
    }
  };

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
    if (!e.target && name) {
      setFormData(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleChildIdChange = (idx, value) => {
    const updated = [...formData.childrenIds];
    updated[idx] = value;
    setFormData(prev => ({ ...prev, childrenIds: updated }));
  };

  const addChildField = () => {
    setFormData(prev => ({ ...prev, childrenIds: [...prev.childrenIds, ''] }));
  };

  const removeChildField = (idx) => {
    const updated = formData.childrenIds.filter((_, i) => i !== idx);
    setFormData(prev => ({ ...prev, childrenIds: updated }));
  };

  async function formAction(e) {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key === 'childrenIds') return; // skip childrenIds validation
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    console.log(formData)
    try {
      const res = await axiosPrivate.post('/auth/register-parent', formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log(formData)
      if (res.status === 201) {
        toast.success('Registration successful!');
        let redirectPath;
        const user = res.data.user;
        setAuth({ user, accessToken: res.data.accessToken });
        if (from && from !== "/") {
          redirectPath = from;
        } else if (user?.role) {
          switch (user.role.toLowerCase()) {
            case 'parent':
              redirectPath = '/parent';
              break;
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
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 500);
        setFormData({
          username: '',
          email: '',
          password: '',
          level: '',
          role: 'parent',
          childrenIds: ['']
        });
        setErrors({});
        setPasswordStrength(0);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Signup failed');
    }
  }
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
    <form className="flex flex-col gap-5" onSubmit={formAction} autoComplete="off">
      {errors.general && (
        <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">{errors.general}</div>
      )}
      <div className="flex flex-col gap-2">
        <Input
          id="username"
          type="text"
          name="username"
          placeholder="Enter your username"
          value={formData.username}
          onChange={handleChange}
          required
          aria-invalid={!!errors.username}
        />
        {errors.username && (
          <span className="text-xs text-red-500">{errors.username}</span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <span className="text-xs text-red-500">{errors.email}</span>
        )}
      </div>
      <div className="flex flex-col gap-2 relative">
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
            aria-invalid={!!errors.password}
            className="pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
                    {formData.password && (
                        <div className='mt-2'>
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
      <div>
        <Label className="font-semibold">
          <span className="text-xs text-muted-foreground">(optional)</span>
        </Label>
        <div className="flex flex-col gap-2 mt-2">
          {formData.childrenIds.map((id, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Child User ID"
                value={id}
                onChange={e => handleChildIdChange(idx, e.target.value)}
              />
              {formData.childrenIds.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeChildField(idx)}
                  aria-label="Remove child"
                >
                  &times;
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-2"
          onClick={addChildField}
        >
          + Add Another Child
        </Button>
      </div>
      <Button
        type="submit"
        className="w-full mt-2"
      >
        Sign Up
      </Button>
    </form>
  );
}

export default ParentSignUpForm;