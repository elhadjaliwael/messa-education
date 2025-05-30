import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
// Create a transporter
const transporter = nodemailer.createTransport({
  host: process.env.HOST ,
  port: Number(process.env.EMAIL_PORT),
  service: process.env.SERVICE,
  secure: Boolean(process.env.SECURE),
  auth: {
    user: process.env.USER ,
    pass: process.env.PASS
  }
});

// Send email function
export const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.USER || 'E-Learning Platform <noreply@elearning.com>',
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};