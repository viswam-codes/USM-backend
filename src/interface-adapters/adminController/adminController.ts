import { Request, Response } from "express";
import { LoginAdminUseCase } from "../../application/adminUseCase/loginAdmin";
import { MongoUserRepository } from "../../infraStructure/database/MongoUserRepository";
import { generateToken } from "../../shared/utils/tokenHelper";
import { UserFetchingUserCase } from "../../application/adminUseCase/userFetching";

const adminRepository = new MongoUserRepository();
const loginAdmin = new LoginAdminUseCase(adminRepository);
const userFetching = new UserFetchingUserCase(adminRepository);

export const adminLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    const admin = await loginAdmin.execute({ email, password });

    if (admin?.role === "user") {
      res.status(401).json({ message: "Not registered as admin" });
      return;
    }

    if (!admin) {
      console.log("Error");

      res.status(401).json({ message: "Invalid credentials" });
    }

    if (!admin?._id) {
      throw new Error("User ID is required for token generation");
    }

    const adminAccessToken = generateToken(admin._id);

    res.cookie("adminToken", adminAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour in milliseconds
    });

    res.status(200).json({ admin, adminAccessToken });
    console.log("Admin Logged In");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

export const adminLogout = (req: Request, res: Response) => {
  // Clear the JWT cookie
  console.log("reaching here");
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  console.log(" admin token cleared");

  res.status(200).json({ message: "Logged out successfully" });
};

export const findUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Finding users with the role 'user'");

    const users = await userFetching.execute();

    res.status(200).json(users);
  } catch (error: any) {
    console.log("Error fetching users:", error.message);
    res.status(500).json({ message: "An error occurred while fetching users" });
  }
};
