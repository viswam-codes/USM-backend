import { UserRepository } from "../../domain/repositories/userRepository";
import { User } from "../../domain/entities/User";
import { UserModel, UserDocument } from "./userSchema";

export class MongoUserRepository implements UserRepository {
  async save(user: User): Promise<User> {
    const userDocument: UserDocument = new UserModel({
      name: user.name,
      email: user.email,
      password: user.password,
      image: user.image,
    });

    const savedUser = await userDocument.save();
    return new User({
      _id: savedUser._id.toString(),
      name: userDocument.name,
      email: userDocument.email,
      password: userDocument.password,
      image: userDocument.image,
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    const userDocument = await UserModel.findOne({ email });
    if (!userDocument) {
      return null;
    }
    return new User({
      _id: userDocument._id.toString(),
      name: userDocument.name,
      email: userDocument.email,
      password: userDocument.password,
      image: userDocument.image,
      role: userDocument.role,
    });
  }

  async findById(id: string): Promise<User | null> {
    const userDocument = await UserModel.findById(id);
    if (!userDocument) return null;
    return new User({
      _id: userDocument._id.toString(),
      name: userDocument.name,
      email: userDocument.email,
      password: userDocument.password,
      image: userDocument.image,
    });
  }

  async update(id: string, user: User): Promise<User | null> {
    const existingUserDocument = await UserModel.findById(id);
    if (!existingUserDocument) return null;

    // Create an object to hold the updated fields
    const updatedFields: Partial<User> = {
      name: user.name,
      email: user.email,
      image: user.image,
    };

    const userDocument = await UserModel.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true }
    );

    if (!userDocument) return null;

    return new User({
      _id: userDocument._id.toString(),
      name: userDocument.name,
      email: userDocument.email,
      password: existingUserDocument.password,
      image: userDocument.image,
    });
  }

  async findUsers(): Promise<User[]> {
    const userDocument = await UserModel.find({ role: "user" });

    const users = userDocument.map(
      (userDocument) =>
        new User({
          _id: userDocument._id.toString(),
          name: userDocument.name,
          email: userDocument.email,
          password: userDocument.password,
          image: userDocument.image,
          role: userDocument.role,
        })
    );
    return users;
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(id);
      if (!deletedUser) {
        return false; 
      }
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false; // Deletion failed
    }
  }
}
