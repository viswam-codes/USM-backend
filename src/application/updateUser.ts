import { UserRepository } from "../domain/repositories/userRepository";
import { User } from "../domain/entities/User";

interface UpdateUserDTO {
    name?:string;
    email?:string;
    image?:string;
}


export class UpdateUserUseCase {
    private userRepository: UserRepository;
    constructor(userRepository:UserRepository){
        this.userRepository=userRepository
    }

    public async execute(userId: string, data: UpdateUserDTO): Promise<User | null> {
        // Find the existing user
        const existingUser = await this.userRepository.findById(userId);
        
        if (!existingUser) {
          throw new Error("User not found");
        }
        
        const updatedUser = {
          ...existingUser,
          ...data, 
        };
    
        // Save the updated user in the repository
        const savedUser = await this.userRepository.update(userId, updatedUser);
        
        return savedUser;
      }
}