import express from 'express';
import {
    register, 
    login, 
    getProfile, 
    getAllUsers, 
    logout, 
    refresh,
    verify,
    updateProfile,
    changePassword,
    addTeacher,
    getTeachers,
    deleteTeacher,
    updateTeacher
} from '../controllers/auth.controller.js';
import { googleAuth, googleCallback } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout); 
router.post('/refresh', refresh);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Protected routes
router.get('/verify', verifyToken, verify);
router.get('/profile', verifyToken, getProfile); // Added profile endpoint
router.get('/users', verifyToken, getAllUsers);
router.get('/users/:id', verifyToken, getProfile); 

router.post('/users/add-teacher', verifyToken, addTeacher);
router.get('/teachers',verifyToken, getTeachers);
router.delete('/teachers/:id', verifyToken, deleteTeacher);
router.put('/teachers/:id', verifyToken, updateTeacher);
// Update this route to handle file uploads properly
router.post('/users/update-profile',verifyToken, upload.single('avatar'),updateProfile );
router.post('/users/change-password', verifyToken, changePassword);

export default router;