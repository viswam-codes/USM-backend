import { UserRepository } from "../../domain/repositories/userRepository";

export class DeleteUser {
  constructor(private userRepository: UserRepository) {}

 
  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error("User ID is required");
    }

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    const isDeleted = await this.userRepository.deleteUser(id);

    if (!isDeleted) {
      throw new Error("Failed to delete user");
    }

    console.log(`User with ID ${id} has been deleted successfully.`);
  }
}
