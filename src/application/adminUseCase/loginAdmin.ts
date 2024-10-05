import { UserRepository } from "../../domain/repositories/userRepository";
import bcrypt from "bcrypt";

interface LoginAdminDTO {
  email: string;
  password: string;
}

export class LoginAdminUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, password }: LoginAdminDTO) {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        console.log("User not found");
        return;
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log("Invalid credentials");
        return;
      }
      return user;
    } catch (error: any) {
      console.log(error.message);
      throw new Error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  }
}
