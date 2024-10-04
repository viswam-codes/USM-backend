import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Access denied." });
    return; 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    req.body.user = decoded;

    next();
  } catch (error: any) {
    console.log(error.message);

    res.status(403).json({ message: "Invalid token." });
  }
};
