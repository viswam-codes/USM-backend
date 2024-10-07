import {User} from '../entities/User';

export interface UserRepository{
    findById(id:string):Promise <User | null >;
    save(user:User):Promise<User>;
    findByEmail(email:string):Promise<User|null>;
    update(id: string, user: User): Promise<User | null>; 
    findUsers():Promise<User[]>
    deleteUser(userId: string): Promise<boolean>
}