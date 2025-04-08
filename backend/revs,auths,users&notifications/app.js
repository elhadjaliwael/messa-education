require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();
//set security HTTP headers
app.use(helmet());

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: " Too many requests from this IP, please try again in 30 minute",
});
app.use("/api", limiter);

app.use(express.json());
//http://localhost:3000
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/notifications", notificationRoutes);

//ayy heja feha . wl $ matet3adesh
app.use(mongoSanitize());
// convert html request
app.use(xss());

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("DB connected"));

module.exports = app;
