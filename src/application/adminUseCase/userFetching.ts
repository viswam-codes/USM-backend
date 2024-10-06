import { UserRepository } from "../../domain/repositories/userRepository";
import { User } from "../../domain/entities/User";
export class UserFetchingUserCase {
    constructor(private userRepository : UserRepository){}

    async execute():Promise<User[]>{
        try{
            const users = await this.userRepository.findUsers();

            if(!users || users.length === 0){
                console.log("No users found with role user");
                return [];
            }
            return users
        }catch(error:any){
            console.log("Error fetching users:",error.message)
            throw new Error(
                error instanceof Error ? error.message : "An unexpected error occurred while fetching users"
              );
        }

        
    }
}