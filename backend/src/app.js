import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "../routes/user.routes.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/admin", authMiddleware, adminMiddleware);


export default app;
