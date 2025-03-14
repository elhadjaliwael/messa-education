import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login",(req,res) => {
    const {username,password} = req.body;
    //check if username and password are correct from database
    if(username === "admin" && password === "admin"){
        const token = jwt.sign({username},process.env.JWT_SECRET,{expiresIn : "1h"});
        console.log(token);
        res.cookie("token",token,{httpOnly : true,secure : true});
        res.json({message : "Logged in successfully"});
    }
    else{
        res.status(401).json({error : "Invalid username or password"});
    }
})

router.post("/logout",(req,res) => {
    res.clearCookie("token");
    res.json({message : "Logged out successfully"});
})

export default router;

