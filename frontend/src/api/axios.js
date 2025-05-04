import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

// Public axios instance - for endpoints that don't require authentication
export const axiosPublic = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true // Important for cookies
});

// Private axios instance - for authenticated requests
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

// Make sure your axiosPublic instance has this configuration
axiosPublic.defaults.withCredentials = true;