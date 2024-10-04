import { UserRepository } from "../domain/repositories/userRepository";
import { User } from "../domain/entities/User";
import bcrypt from "bcrypt";

//input DTO (Data Transfer Object)

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  image: string;
}

export class CreateUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public async execute(data: CreateUserDTO): Promise<User> {
    const { name, email, password, image } = data;
    //checking email already exists
    const existingUser = await this.userRepository.findByEmail(email);
    
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    //password hashing
  console.log("Hashed password",password);
    const hashedpassword = await bcrypt.hash(password, 10);

    //creating new user entity
    const newUser = new User({
      name,
      email,
      password: hashedpassword, //storing the hashed password
      image,
    });

    //saving the user in the repository
    const savedUser=await this.userRepository.save(newUser);

    return savedUser;
  }
}
