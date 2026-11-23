import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "../routes/user.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", userRoutes);


export default app;