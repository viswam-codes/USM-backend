import { Request, Response } from "express";
import { CreateUserUseCase } from "../../application/createUser";
import { MongoUserRepository } from "../../infraStructure/database/MongoUserRepository";
import { LoginUserUserCase } from "../../application/loginUser";
import { generateToken } from "../../shared/utils/tokenHelper";

//intializing the repository and use-case
const userRepository = new MongoUserRepository();
const createUser = new CreateUserUseCase(userRepository);
const loginUserUserCase = new LoginUserUserCase(userRepository);

//controller function for handling the registration

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    console.log(req.file);

    if (!req.file) {
      res.status(400).json({ message: "Image is required" });
      return;
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;

    //calling the usecase
    const user = await createUser.execute({
      name,
      email,
      password,
      image: imageUrl,
    });

    //excluding password
    const { password: _, ...userData } = user;

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true, // Ensures the cookie is only accessible by the web server
      secure: process.env.NODE_ENV === "production", // Ensures the cookie is sent only over HTTPS (in production)
      sameSite: "strict", // CSRF protection
      maxAge: 6000000,
    });

    //response
    res.status(201).json(userData);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    const user = await loginUserUserCase.execute({ email, password });

    if (!user) {
      console.log("Error");
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    if (!user._id) {
      throw new Error("User ID is required for token generation");
    }

    const accessToken = generateToken(user._id);

    //putting token in the cookie
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour in milliseconds
    });

    res.status(200).json({ user, accessToken });
    console.log("User Logged In");
  } catch (error) {
    console.log(error);
  }
};

export const logoutUser = (req: Request, res: Response) => {
  // Clear the JWT cookie
  console.log("reaching here");
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  console.log("Cookie cleared");

  res.status(200).json({ message: "Logged out successfully" });
};
