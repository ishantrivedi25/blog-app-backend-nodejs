import mongoose, { Document, Schema } from "mongoose";

// Define an interface for the Post document
interface IPost extends Document {
  userId: string;
  content: string;
  title: string;
  image: string;
  category: string;
  slug: string;
}

// Define the Post Schema
const postSchema = new Schema<IPost>(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Create the model using the IPost interface
const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
