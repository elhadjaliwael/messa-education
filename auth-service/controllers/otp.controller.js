import User from '../models/user.model.js';
import { sendMail } from '../utils/sendMail.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email }).select('+emailVerificationOTP +otpExpiresAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with OTP
    user.emailVerificationOTP = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send OTP email
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Email Verification</h2>
        <p>Hello ${user.username},</p>
        <p>Thank you for signing up! Please use the following OTP to verify your email address:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply.</p>
      </div>
    `;

    await sendMail({
      to: email,
      subject: 'Email Verification - OTP',
      html: emailContent
    });

    res.status(200).json({ 
      message: 'OTP sent successfully',
      email: email
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email }).select('+emailVerificationOTP +otpExpiresAt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    if (!user.emailVerificationOTP || !user.otpExpiresAt) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }

    if (new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    if (user.emailVerificationOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Verify email
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ 
      message: 'Email verified successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      },
      accessToken // Include the access token in response
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email }).select('+emailVerificationOTP +otpExpiresAt');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Check if we can resend (prevent spam)
    if (user.otpExpiresAt && new Date() < new Date(user.otpExpiresAt.getTime() - 8 * 60 * 1000)) {
      return res.status(400).json({ 
        message: 'Please wait before requesting a new OTP',
        canResendAt: new Date(user.otpExpiresAt.getTime() - 8 * 60 * 1000)
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    user.emailVerificationOTP = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send OTP email
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Email Verification - Resent OTP</h2>
        <p>Hello ${user.username},</p>
        <p>Here's your new OTP for email verification:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply.</p>
      </div>
    `;

    await sendMail({
      to: email,
      subject: 'Email Verification - New OTP',
      html: emailContent
    });

    res.status(200).json({ 
      message: 'New OTP sent successfully',
      email: email
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Failed to resend OTP' });
  }
};