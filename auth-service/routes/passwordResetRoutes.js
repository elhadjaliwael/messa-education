import express from "express";
import { resetPassword,sendingMail,validateToken } from "../controllers/reset.controller.js";
const router = express.Router();

router.post("/",sendingMail);
router.get("/:id/:token",validateToken);
router.post("/:id/:token",resetPassword);
//TODO : add a route for resetting password from inside the app
export default router;