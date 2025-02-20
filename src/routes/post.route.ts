import express from "express";

import { verifyToken } from "../utils/verifyUser";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from "../controllers/post.controller";
import { validateData } from "../middlewares/validateData";
import {
  createPostSchema,
  getPostsSchema,
  updatePostSchema,
  deletePostSchema,
} from "../schemas/postSchemas";

const router = express.Router();

router.post("/", validateData(createPostSchema), verifyToken, createPost);
router.get("/", validateData(getPostsSchema), getPosts);
router.put("/:postId", validateData(updatePostSchema), verifyToken, updatePost);
router.delete(
  "/:postId",
  validateData(deletePostSchema),
  verifyToken,
  deletePost
);

export default router;
