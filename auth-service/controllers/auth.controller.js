import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import { notifyTeacherAdded } from '../services/rabbitmq.service.js';
dotenv.config();
// Generate tokens
const generateAccessToken = (user) => {
    return jwt.sign(
        { 
            id: user._id,
            email: user.email,
            role: user.role,
            level : user.level,
            username : user.username,
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};

// Register new user
export const register = async (req, res) => {
    try {
        const { level,username, email, password, role = 'student' } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or : [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash password with bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
            level
        });
        
        await newUser.save();
        
        // Generate tokens
        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);
        
        // Save refresh token to user
        newUser.refreshToken = refreshToken;
        await newUser.save();
        
        // Set refresh token as HttpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        // Send user data and access token
        const userData = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            level : newUser.level,
            avatar: newUser.avatar,
        };
        
        res.status(201).json({
            user: userData,
            accessToken
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user
        console.log(email,password)
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        try {
            // Verify password with bcrypt
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log("Password verification result:", isPasswordValid);
            
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            
            // Generate tokens
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            
            // Save refresh token to user
            user.refreshToken = refreshToken;
            await user.save();
            
            // Set refresh token as HttpOnly cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            
            // Send user data and access token
            const userData = {
                id: user._id,
                username: user.username, // Changed from name to username to match your model
                email: user.email,
                role: user.role,
                level : user.level,
                avatar: user.avatar,
            };
            
            res.status(200).json({
                user: userData,
                accessToken
            });
        } catch (verifyError) {
            console.error('Password verification error:', verifyError);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Refresh token
export const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token required' });
        }
        
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        // Find user by ID only first, then check the token
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }
        
        // Generate new access token regardless of token match
        // This is more forgiving and helps with token persistence issues
        const accessToken = generateAccessToken(user);
        
        // Send user data and new access token
        const userData = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            level : user.level,
            avatar: user.avatar,
        };
        
        res.status(200).json({
            user: userData,
            accessToken
        });
        
    } catch (error) {
        console.error('Refresh token error:', error);
        
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }
        
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout user
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if (refreshToken) {
            // Find user with this refresh token and clear it
            await User.findOneAndUpdate(
                { refreshToken },
                { $set: { refreshToken: '' } }
            );
        }
        
        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const user = await User.findById(userId).select('-password -refreshToken');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        
        const users = await User.find().select('-password -refreshToken');
        
        res.status(200).json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify token
export const verify = async (req, res) => {
    // If middleware passes, token is valid
    res.status(200).json({ valid: true, user: req.user });
};

// Google OAuth handlers
export const googleAuth = (req, res) => {
    // Make sure the redirect URI is properly defined
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;
    console.log(redirectUri)
    if (!process.env.GOOGLE_CLIENT_ID || !redirectUri) {
        console.error('Google OAuth configuration missing:', { 
            clientId: !!process.env.GOOGLE_CLIENT_ID, 
            redirectUri: !!redirectUri 
        });
        return res.status(500).json({ message: 'OAuth configuration error' });
    }
    
    // Redirect to Google OAuth
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=profile email`;
    console.log('Redirecting to Google OAuth URL:', googleAuthUrl);
    res.redirect(googleAuthUrl);
};

export const googleCallback = async (req, res) => {
    try {
        const { code } = req.query;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI;
        
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !redirectUri) {
            console.error('Google OAuth configuration missing');
            return res.redirect(`${process.env.FRONTEND_URL || '/'}/login?error=oauth_config_error`);
        }
        
        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });
        
        // Rest of the function remains the same
        const tokenData = await tokenResponse.json();
        
        // Get user info
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
            },
        });
        
        const userInfo = await userInfoResponse.json();
        
        // Find or create user
        let user = await User.findOne({ email: userInfo.email });
        
        if (!user) {
            // Create new user with bcrypt hashed random password
            const randomPassword = Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);
            
            user = new User({
                username: userInfo.name,
                email: userInfo.email,
                password: hashedPassword,
                role: 'student',
                googleId: userInfo.id,
            });
            
            await user.save();
        } else if (!user.googleId) {
            // Link Google account to existing user
            user.googleId = userInfo.id;
            await user.save();
        }
        
        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        
        // Save refresh token to user
        user.refreshToken = refreshToken;
        await user.save();
        
        // Set refresh token as HttpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        // Redirect to frontend with access token and user role
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${accessToken}&role=${user.role}`);
    } catch (error) {
        console.error('Google callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
    }
};

// Configure Cloudinary (add this near the top of your file after imports)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Update the updateProfile function
export const updateProfile = async (req, res) => {
    try {
        const avatar = req.file;
        const userId = req.user.id;
        const { username, email } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        user.username = username || user.username;
        user.email = email || user.email;
        
        // If avatar is uploaded, upload to Cloudinary
        if (avatar) {
            try {
                // Upload to Cloudinary
                const result = await cloudinary.uploader.upload(avatar.path, {
                    folder: 'user_avatars',
                    public_id: `user_${userId}_${Date.now()}`,
                    overwrite: true,
                    resource_type: 'image'
                });
                
                // Save the Cloudinary URL to the user's profile
                user.avatar = result.secure_url;
                
                // Optionally delete the local file after upload
                const fs = await import('fs');
                fs.unlinkSync(avatar.path);
            } catch (cloudinaryError) {
                console.error('Cloudinary upload error:', cloudinaryError);
                return res.status(500).json({ 
                    message: 'Error uploading image to cloud storage',
                    error: cloudinaryError.message
                });
            }
        }
        
        await user.save();
        
        // Return updated user data
        const userData = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            level: user.level,
            avatar: user.avatar
        };
        
        res.status(200).json({ 
            message: 'Profile updated successfully',
            user: userData
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(userId); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); 
        }
        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid current password' });
        }
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        // Update password
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error' });
    } 
}

export const addTeacher = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Only admins can add teachers' });
        }
        
        const { username, email, subject, phone, classes,status } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Teacher with this username or email already exists' });
        }
        
        // Generate a random password
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-2) + Math.floor(Math.random() * 10);
        
        // Hash password with bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(generatedPassword, salt);
        
        // Create new teacher user
        const newTeacher = new User({
            username,
            email,
            password: hashedPassword,
            role: 'teacher',
            classes,
            subject,
            phoneNumber: phone,
            status,
            // Store the temporary password in a field that won't be used for authentication
            // This will be accessible for a limited time after creation
            tempPassword: generatedPassword
        });
        
        await newTeacher.save()
        // Return teacher data with the generated password
        const teacherData = {
            id: newTeacher._id,
            username: newTeacher.username,
            email: newTeacher.email,
            role: newTeacher.role,
            subject: newTeacher.subject,
            phone: newTeacher.phoneNumber,
            classes: newTeacher.classes,
            password: generatedPassword // Include the plain text password in the response
        };
        if(newTeacher.status==='Active'){
            console.log("sending notification")
            await notifyTeacherAdded(teacherData);
        }
    
        res.status(201).json({
            message: 'Teacher account created successfully',
            teacher: teacherData
        });
    } catch (error) {
        console.error('Add teacher error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getTeachers = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Only admins can view teachers' });
        } 
        
        // Fetch all teachers from the database
        const teachers = await User.find({ role: 'teacher' }).select('-password +tempPassword');
        // Transform the data to include necessary fields
        const formattedTeachers = teachers.map(teacher => {
            // Create a base teacher object with all needed fields
            const teacherData = {
                id: teacher._id,
                username: teacher.username,
                name: teacher.username,
                email: teacher.email,
                phone: teacher.phoneNumber || 'N/A',
                subject: teacher.subject || 'Not assigned',
                classes: teacher.classes || [],
                status: teacher.status || 'Active',
                createdAt: teacher.createdAt,
                avatar: teacher.avatar,
                // Include the temporary password if it exists in the session storage
                password: teacher.tempPassword || undefined
            };
            
            return teacherData;
        });
        // Return the list of teachers
        res.status(200).json(formattedTeachers);
    } catch (error) {
        console.error('Get teachers error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const deleteTeacher = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Only admins can delete teachers' });
        }

        const teacherId = req.params.id;
        const teacher = await User.findById(teacherId);

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        // Delete the teacher
        await teacher.deleteOne();
        res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error('Delete teacher error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

export const updateTeacher = async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email, level, emailNofification, role, classes, status } = req.body;
        const user = await User.findById(userId); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Update user fields
        user.username = username || user.username;
        user.email = email || user.email;
        user.level = level || user.level;
        user.emailNofification = emailNofification || user.emailNofification;
        user.role = role || user.role;
        user.classes = classes || user.classes;
        user.status = status || user.status;
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });

        
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' }); 
    }
}
export const getStudentsByClass = async (req, res) => {
    try {
        const classLevel = req.params.classLevel;
        const students = await User.find({ role: 'student', level: classLevel }).select('-password');
        res.status(200).json(students); 
    }catch (error) {
        console.error('Get students by class error:', error);
        res.status(500).json({ message: 'Server error' }); 
    }
}
export const getTeacherById = async (req, res) => {
    try {
        const teacherId = req.params.id;
        const teacher = await User.findById(teacherId).select('-password'); 
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });

        }
        res.status(200).json(teacher);

    }catch (error) {
        console.error('Get teacher by id error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
export const getTeacherBySubjectAndLevel = async (req, res) => {
    try {
        const { subject, studentLevel } = req.params;
        console.log(subject, studentLevel)
        console.log("waaa")
        const teachers = await User.find({ role: 'teacher', subject,  classes: { $in: [studentLevel]} }).select('-password');
        console.log(teachers)
        res.status(200).json(teachers); 
    } 
    catch (error) {
        console.error('Get teacher by subject and level error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}
export const getAnalytics = async (req, res) => {
    try {
        // Check if user is admin
        console.log("w")
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Only admins can access analytics' });
        }
        
        // Get total counts
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalTeachers = await User.countDocuments({ role: 'teacher' });
        const activeTeachers = await User.countDocuments({ role: 'teacher', status: 'Active' });
        
        // Get class distribution (for students) grouped into three categories
        const classDistribution = await User.aggregate([
            { $match: { role: 'student' } },
            {
                $addFields: {
                    educationLevel: {
                        $cond: {
                            if: { $regexMatch: { input: "$level", regex: /^[1-6]eme_annee/ } },
                            then: "École Primaire",
                            else: {
                                $cond: {
                                    if: { $regexMatch: { input: "$level", regex: /^[7-9]eme_annee/ } },
                                    then: "Collège",
                                    else: "Lycée"
                                }
                            }
                        }
                    }
                }
            },
            { $group: { _id: '$educationLevel', count: { $sum: 1 } } },
            { $project: { name: '$_id', value: '$count', _id: 0 } },
            { $sort: { name: 1 } }
        ]);
        
        // Get subject distribution (for teachers)
        const subjectDistribution = await User.aggregate([
            { $match: { role: 'teacher' } },
            { $group: { _id: '$subject', count: { $sum: 1 } } },
            { $project: { name: '$_id', value: '$count', _id: 0 } },
            { $sort: { value: -1 } }
        ]);
        
        // Get registration trends (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const registrationTrends = await User.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' },
                        role: '$role'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id.month',
                    year: '$_id.year',
                    role: '$_id.role',
                    count: 1
                }
            },
            { $sort: { year: 1, month: 1 } }
        ]);
        
        // Format registration trends into a more usable format
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedTrends = [];
        
        // Initialize with all months
        const currentDate = new Date();
        for (let i = 0; i < 6; i++) {
            const date = new Date(currentDate);
            date.setMonth(date.getMonth() - i);
            const monthName = months[date.getMonth()];
            const year = date.getFullYear();
            
            formattedTrends.unshift({
                name: `${monthName} ${year}`,
                students: 0,
                teachers: 0,
                total: 0
            });
        }
        
        // Fill in actual data
        registrationTrends.forEach(item => {
            const monthName = months[item.month - 1];
            const formattedMonth = `${monthName} ${item.year}`;
            
            const existingMonth = formattedTrends.find(m => m.name === formattedMonth);
            if (existingMonth) {
                if (item.role === 'student') {
                    existingMonth.students = item.count;
                } else if (item.role === 'teacher') {
                    existingMonth.teachers = item.count;
                }
                existingMonth.total += item.count;
            }
        });
        
        // Get recent registrations (last 10)
        const recentRegistrations = await User.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('username email role level createdAt avatar');
        
        // Get teacher-to-student ratio by class
        const teacherStudentRatio = [];
        const classLevels = [...new Set(classDistribution.map(c => c.name))];
        
        for (const level of classLevels) {
            if (!level) continue; // Skip if level is null or undefined
            
            const studentsCount = await User.countDocuments({ role: 'student', level });
            const teachersCount = await User.countDocuments({ 
                role: 'teacher', 
                classes: { $in: [level] } 
            });
            
            teacherStudentRatio.push({
                class: level,
                students: studentsCount,
                teachers: teachersCount,
                ratio: teachersCount > 0 ? (studentsCount / teachersCount).toFixed(1) : 'N/A'
            });
        }
        
        res.status(200).json({
            overview: {
                totalUsers,
                totalStudents,
                totalTeachers,
                activeTeachers,
                studentPercentage: Math.round((totalStudents / totalUsers) * 100),
                teacherPercentage: Math.round((totalTeachers / totalUsers) * 100)
            },
            classDistribution,
            subjectDistribution,
            registrationTrends: formattedTrends,
            recentRegistrations,
            teacherStudentRatio
        });
        
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({ 
            message: 'Failed to retrieve analytics data',
            error: error.message 
        });
    }
};
export const registerParent = async (req, res) => {
    try {
        const { username, email, password, childrenIds = [] } = req.body;
        // Filter out empty or invalid child IDs
        const filteredChildrenIds = (childrenIds || []).filter(id => id && id.trim() !== '');

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create parent user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'parent',
            children: filteredChildrenIds // Only valid ObjectIds
        });
        await newUser.save();
        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);
        
        // Save refresh token to user
        newUser.refreshToken = refreshToken;
        await newUser.save();
        
        // Set refresh token as HttpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        // Send user data and access token
        const userData = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            level : newUser.level,
            avatar: newUser.avatar,
        };
        
        res.status(201).json({
            user: userData,
            accessToken
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const getChildren = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate('children'); 
        const childrens = [];
        for (let child of user.children) {
            const childData = {
                id: child._id,
                username: child.username,
                email: child.email,
                role: child.role,
                level : child.level,
                avatar: child.avatar,
            };
            childrens.push(childData);
        }
        res.status(200).json(childrens);
    }catch (error) {
        console.error('Get children error:', error);
        res.status(500).json({ message: 'Server error' });
    } 
}
export const addChild = async (req, res) => {
    try {
        const userId = req.user.id;
        const { childId } = req.body; 
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const child = await User.findById(childId);
        if (!child) {
            return res.status(404).json({ message: 'Child not found' });
        }
        user.children.push(childId);
        await user.save();
        res.status(200).json({ message: 'Child added successfully',child});

    } catch(err){
        console.error('Add child error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}