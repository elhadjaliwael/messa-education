import User from "../models/user.model.js";
import Token from "../models/token.model.js";
import crypto from "crypto";
import { sendMail } from "../utils/sendMail.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
export const sendingMail = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
        token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();
    }
    const link = `${process.env.FRONTEND_URL}/forgot-password/${user._id}/${token.token}`;
    await sendMail({ 
      to: user.email, 
      subject: "Password reset", 
      text: link 
    });
    res.send("password reset link sent to your email account");
  }catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
export const validateToken = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).send("invalid link or expired");

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");

        res.status(200).send("Valid Url");
    }catch (error) {
        res.status(500).send("An error occured");
        console.log(error);
    }
}
export const resetPassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).send("Invalid link or expired");

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // Update password
        user.password = hashedPassword;
        await user.save();
        await token.deleteOne();

        res.send("password reset sucessfully.");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
}