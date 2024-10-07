import { Request, Response } from "express";
import { LoginAdminUseCase } from "../../application/adminUseCase/loginAdmin";
import { MongoUserRepository } from "../../infraStructure/database/MongoUserRepository";
import { generateToken } from "../../shared/utils/tokenHelper";
import { UserFetchingUserCase } from "../../application/adminUseCase/userFetching";
import { UpdateUserUseCase } from "../../application/updateUser";
import { DeleteUser } from "../../application/adminUseCase/deleteUser";

const adminRepository = new MongoUserRepository();
const loginAdmin = new LoginAdminUseCase(adminRepository);
const userFetching = new UserFetchingUserCase(adminRepository);
const updateUserUseCase = new UpdateUserUseCase(adminRepository);
const deleteUserUseCase = new DeleteUser(adminRepository);

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
      return;
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

export const editUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const { name, email } = req.body;

    const imageUrl = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : undefined;

    const updateData = {
      name,
      email,
      ...(imageUrl && { image: imageUrl }), // Only include image if it exists
    };

    const updatedUser = await updateUserUseCase.execute(userId, updateData);

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { password: _, ...userData } = updatedUser;
    res.status(200).json(userData);
  } catch (error: any) {
    console.log("Error updating User", error.message);
  }
};


export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    console.log(`Deleting user with ID: ${userId}`);

    await deleteUserUseCase.execute(userId);

    res.status(200).json({ message: `User with ID ${userId} has been deleted successfully` });
  } catch (error: any) {
    console.log("Error deleting user:", error.message);
    res.status(500).json({ message: "An error occurred while deleting the user" });
  }
};