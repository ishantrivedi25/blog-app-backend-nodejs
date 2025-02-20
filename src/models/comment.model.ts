import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Comment document
interface IComment extends Document {
  content: string;
  postId: string;
  userId: string;
  likes: string[];
  numberOfLikes: number;
}

// Define the Comment Schema
const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    likes: {
      type: [String],
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create the model using the interface
const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
