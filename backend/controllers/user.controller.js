import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const registerUserController = async (req, res) =>{
    const { name, email, password } = req.body;

    if(!name || !email || !password){
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    try{

        const existingUser = await userModel.findOne({
            email
        });

        if(existingUser){
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = await userModel.create({
            name,
            email,
            password
        });

        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

         res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            token
        });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const loginUserController = async (req, res) =>{
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({ message: "Please provide all required fields" });
    }

    try{
        const user = await userModel.findOne({
            email
        }).select("+password");
    
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }

        if(!user.isActive){
            return res.status(403).json({ message: "User account is deactivated" });
        }
    
        const isPasswordValid = await user.comparePassword(password);
    
        if(!isPasswordValid){
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        });
    
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }

}

export const logoutUserController = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        });

        return res.status(200).json({
            message: "User logged out successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};