import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter once and reuse
const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    service: process.env.SERVICE,
    port: Number(process.env.EMAIL_PORT),
    secure: Boolean(process.env.SECURE),
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    },
    pool: true, // Use connection pooling
    maxConnections: 5,
    maxMessages: 100
});

export const sendMail = async ({ to, subject, text, html }) => {
    try {
        const mailOptions = {
            from: process.env.USER,
            to: to,
            subject: subject,
        };

        if (html) {
            mailOptions.html = html;
        } else {
            mailOptions.text = text;
        }

        await transporter.sendMail(mailOptions);
        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
        throw error; // Re-throw for proper error handling
    }
};