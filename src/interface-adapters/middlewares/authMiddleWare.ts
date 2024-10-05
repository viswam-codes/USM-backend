import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    // Get the token from cookies
   console.log("auth");
    const token = req.cookies.token?req.cookies.token:req.cookies.adminToken;
    console.log(token);
    // Check if the token is present
    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }
    try {
      
        // Verify the token using your secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET!); 
        req.body.user = decoded; 
        console.log("req.body",req.body.user)

        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
             res.status(401).json({ message: "Access token expired. Please refresh your token." });
        }  
        console.error(error.message);
        res.status(403).json({ message: "Invalid token." });
    }
};
