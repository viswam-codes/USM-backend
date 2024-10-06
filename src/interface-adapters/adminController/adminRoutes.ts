import { Application } from "express";
import { adminLogin,adminLogout,findUsers} from "./adminController";
import { authenticateToken } from "../middlewares/authMiddleWare";


export const registerAdminRoute = (app:Application)=>{
    app.post('/admin/login',adminLogin)
    app.get('/admin/dashboard/user',authenticateToken,findUsers)
    app.post('/admin/logout',authenticateToken,adminLogout,findUsers)
}