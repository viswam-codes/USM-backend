import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  // Get the token from cookies
  const token = req.cookies.token;

  // Check if the token is present
  if (!token) {
     res.status(401).json({ message: "Access denied. No token provided." });
     return;
  }

  try {
    // Verify the token using your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string };
    req.body.user = decoded;  // Attaching decoded data to request

   

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
       res.status(401).json({ message: "Access token expired. Please log in again." });
       return
    }
    console.error(error.message);
     res.status(403).json({ message: "Invalid token." });
     return
  }
};

export const authenticateAdminToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.adminToken; 
  
    if (!token) {
       res.status(401).json({ message: "Access denied. No admin token provided." });
       return
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string };
      req.body.admin = decoded;
  
      // Check if the user is actually an admin
      if (decoded.role !== 'admin') {
         res.status(403).json({ message: "Access denied. Not authorized as admin." });
         return
      }
  
      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
         res.status(401).json({ message: "Admin access token expired. Please log in again." });
         return
      }
      console.error(error.message);
       res.status(403).json({ message: "Invalid admin token." });
       return
    }
  };






