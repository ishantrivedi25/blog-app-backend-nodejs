import { z } from "zod";

// Schema for creating a new comment
export const createCommentSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, "Content cannot be empty")
      .max(500, "Content is too long"),
    postId: z.string().uuid("Invalid postId format"),
    userId: z.string().uuid("Invalid userId format"),
  }),
});

export const getPostCommentsSchema = z.object({
  params: z.object({
    postId: z.string().min(1, "postId is required"),
  }),
});

// Schema for liking a comment
export const likeCommentSchema = z.object({
  params: z.object({
    commentId: z.string().min(1, "commentId is required"),
  }),
});

// Schema for editing a comment
export const editCommentSchema = z.object({
  params: z.object({
    commentId: z.string().min(1, "commentId is required"),
  }),
  body: z.object({
    content: z
      .string()
      .min(1, "Content cannot be empty")
      .max(500, "Content is too long"),
  }),
});

// Schema for deleting a comment
export const deleteCommentSchema = z.object({
  params: z.object({
    commentId: z.string().min(1, "commentId is required"),
  }),
});

// Schema for fetching comments with pagination and sorting
export const getCommentsSchema = z.object({
  query: z.object({
    startIndex: z
      .string()
      .regex(/^\d+$/, "startIndex must be a number")
      .optional(),
    limit: z.string().regex(/^\d+$/, "limit must be a number").optional(),
    sort: z.enum(["asc", "desc"]).optional(),
  }),
});
