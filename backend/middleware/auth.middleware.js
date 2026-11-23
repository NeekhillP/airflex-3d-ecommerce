import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';


export const authMiddleware = async(req, res, next) =>{
    try{
        const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({message: "Unauthorized"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id);

        if(!user || !user.isActive){
            return res.status(401).json({message: "Unauthorized"});
        }

        req.user = user;

        next();
    } catch(err){
        console.error(err);
        return res.status(500).json({message: "Internal server error"});
    }
}
