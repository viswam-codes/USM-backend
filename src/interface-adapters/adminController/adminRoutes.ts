import { Application } from "express";
import { adminLogin } from "./adminController";


export const registerAdminRoute = (app:Application)=>{
    app.post('/adminLogin',adminLogin)
}