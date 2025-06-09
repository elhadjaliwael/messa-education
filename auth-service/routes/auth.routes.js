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
    updateTeacher,
    getStudentsByClass,
    getTeacherById,
    getTeacherBySubjectAndLevel,
    getAnalytics,
    registerParent,
    getChildren,
    addChild,
    completeGoogleRegistration,
    deleteChild
} from '../controllers/auth.controller.js';
import { sendOTPEmail, verifyOTP, resendOTP } from '../controllers/otp.controller.js';
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
router.post('/complete-google-registration', completeGoogleRegistration);
// OTP routes
router.post('/send-otp', sendOTPEmail);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// Protected routes
router.get('/verify', verifyToken, verify);
router.get('/profile', verifyToken, getProfile); // Added profile endpoint
router.get('/users', verifyToken, getAllUsers);
router.get('/users/:id', verifyToken, getProfile); 

router.post('/users/add-teacher', verifyToken, addTeacher);
router.get('/teachers',verifyToken, getTeachers);
router.get('/students/by-class/:classLevel', verifyToken, getStudentsByClass);
router.get('/teachers/:id', verifyToken, getTeacherById); // Assuming you have a getProfile route for teachers als
router.delete('/teachers/:id', verifyToken, deleteTeacher);
router.get('/teachers/by-subject/:subject/level/:studentLevel',getTeacherBySubjectAndLevel);
router.put('/teachers/:id', verifyToken, updateTeacher);


router.get('/admin/analytics',verifyToken,getAnalytics)
// Update this route to handle file uploads properly
router.post('/users/update-profile',verifyToken, upload.single('avatar'),updateProfile );
router.post('/users/change-password', verifyToken, changePassword);

router.post('/register-parent',registerParent);
router.get('/children',verifyToken,getChildren)
router.post('/children',verifyToken,addChild)
router.delete('/children/:id',verifyToken,deleteChild)
export default router;