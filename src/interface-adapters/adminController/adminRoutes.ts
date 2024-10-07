import multer from "multer";
import path from "path";
import fs from "fs";
import { Application } from "express";
import { adminLogin,adminLogout,findUsers,deleteUser} from "./adminController";
import { authenticateToken } from "../../infraStructure/middlewares/authMiddleWare";
import { editUser } from "./adminController";


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



export const registerAdminRoute = (app:Application)=>{
    app.post('/admin/login',adminLogin)
    app.get('/admin/dashboard/user',authenticateToken,findUsers);
    app.post('/admin/logout',authenticateToken,adminLogout,findUsers);
    app.put("/admin/update/:id",authenticateToken,upload.single('image'),editUser)
    app.delete("/admin/delete/:id",authenticateToken,deleteUser)
}