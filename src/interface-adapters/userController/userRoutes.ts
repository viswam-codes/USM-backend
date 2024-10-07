import multer from "multer";
import path from "path";
import fs from "fs";
import { Application } from "express";
import { loginUser, registerUser,logoutUser,updateUser } from "./userController";
import { authenticateToken } from "../../infraStructure/middlewares/authMiddleWare";

const uploadDir = path.join(__dirname, '../../uploads'); 
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });


export const registerRoutes = (app:Application)=>{
    app.post('/register',upload.single('image'),registerUser)
    app.post('/login',loginUser)
    app.post('/logout',authenticateToken,logoutUser)
    app.put("/update/:id",upload.single('image'),authenticateToken,updateUser)
}

