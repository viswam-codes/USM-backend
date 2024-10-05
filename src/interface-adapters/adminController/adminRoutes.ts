import { Application } from "express";
import { adminLogin } from "./adminController";
import { adminLogout } from "./adminController";
import { authenticateToken } from "../middlewares/authMiddleWare";


export const registerAdminRoute = (app:Application)=>{
    app.post('/admin/login',adminLogin)
    app.post('/admin/logout',authenticateToken,adminLogout)
}