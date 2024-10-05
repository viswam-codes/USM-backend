import mongoose,{Document,Schema} from 'mongoose';

export interface UserDocument extends Document {
    _id:string;
    name:string;
    email:string;
    password:string;
    image:string;
    role:string;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    role:{type:String,default:"user"} // Optional field for user image
  }, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  });

  export const UserModel = mongoose.model<UserDocument>('User',UserSchema)