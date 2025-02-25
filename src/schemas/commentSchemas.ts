import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, "Content cannot be empty")
      .max(500, "Content is too long"),
    postId: z.string().regex(/^[0-9a-f]{24}$/, "Invalid postId format"),
  }),
});

export const getPostCommentsSchema = z.object({
  params: z.object({
    postId: z.string().min(1, "postId is required"),
  }),
});

export const likeCommentSchema = z.object({
  params: z.object({
    commentId: z.string().min(1, "commentId is required"),
  }),
});

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

export const deleteCommentSchema = z.object({
  params: z.object({
    commentId: z.string().min(1, "commentId is required"),
  }),
});

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
