import mongoose, { Document, Schema, Model } from "mongoose";

// Define TypeScript interface for User
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define Mongoose Schema
const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create and export the model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
