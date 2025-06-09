import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { createEmailTemplate } from '../templates/emailTemplate.js';

dotenv.config();

// Create a transporter
const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: Number(process.env.EMAIL_PORT),
  service: process.env.SERVICE,
  secure: Boolean(process.env.SECURE),
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});

// Send email function with modern HTML template
export const sendEmail = async (to, subject, text, customHtml = null) => {
  try {
    // Use custom HTML if provided, otherwise use the modern template
    const htmlContent = customHtml || createEmailTemplate(subject, text);
    
    const mailOptions = {
      from: process.env.USER || 'E-Learning Platform <noreply@elearning.com>',
      to,
      subject,
      text, // Fallback for email clients that don't support HTML
      html: htmlContent
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};