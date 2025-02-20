import express from "express";

import { verifyToken } from "../utils/verifyUser";
import {
  createComment,
  deleteComment,
  editComment,
  getPostComments,
  getComments,
  likeComment,
} from "../controllers/comment.controller";
import { validateData } from "../middlewares/validateData";
import {
  createCommentSchema,
  getPostCommentsSchema,
  likeCommentSchema,
  editCommentSchema,
  deleteCommentSchema,
  getCommentsSchema,
} from "../schemas/commentSchemas";

const router = express.Router();

router.get(
  "/post/:postId",
  validateData(getPostCommentsSchema),
  getPostComments
);

router.use(verifyToken);

router.post("/", validateData(createCommentSchema), createComment);
router.put("/:commentId/like", validateData(likeCommentSchema), likeComment);
router.put("/:commentId", validateData(editCommentSchema), editComment);
router.delete("/:commentId", validateData(deleteCommentSchema), deleteComment);
router.get("/", validateData(getCommentsSchema), getComments);

export default router;
