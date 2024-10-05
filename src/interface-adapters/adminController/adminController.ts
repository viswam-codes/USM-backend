import {Request,Response} from "express";
import { LoginAdminUseCase } from "../../application/adminUseCase/loginAdmin";
import { MongoUserRepository } from "../../infraStructure/database/MongoUserRepository";
import { generateToken } from "../../shared/utils/tokenHelper";

const adminRepository = new MongoUserRepository();
const loginAdmin = new LoginAdminUseCase(adminRepository);



export const adminLogin = async(req:Request,res:Response):Promise<void> =>{
    try{
        console.log(req.body);
        const {email,password} = req.body;

        const admin = await loginAdmin.execute({email,password});

        if(admin?.role==="user"){
            res.status(401).json({ message: "Not registered as admin" });
            return;
        }

        if(!admin){
            console.log("Error");

            res.status(401).json({message:"Invalid credentials"})
        }

        if (!admin?._id) {
            throw new Error("User ID is required for token generation");
          }

          const accessToken = generateToken(admin._id);

          res.cookie("token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000, // 1 hour in milliseconds
          });

          res.status(200).json({ admin, accessToken });
          console.log("Admin Logged In");


    }catch(error){
        console.log(error)
        res.status(500).json({ message: "An error occurred" });
    }
}