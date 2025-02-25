import { z } from "zod";

// Schema for creating a new post
export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(200, "Title is too long"),
    content: z.string().min(1, "Content cannot be empty"),
  }),
});

// Schema for retrieving posts with filters and pagination
export const getPostsSchema = z.object({
  query: z.object({
    startIndex: z
      .string()
      .regex(/^\d+$/, "startIndex must be a number")
      .optional(),
    limit: z.string().regex(/^\d+$/, "limit must be a number").optional(),
    sort: z.enum(["asc", "desc", ""]).optional(),
    userId: z.string().optional(),
    category: z.string().optional(),
    slug: z.string().optional(),
    postId: z.string().optional(),
    searchTerm: z.string().optional(),
  }),
});

// Schema for updating a post
export const updatePostSchema = z.object({
  params: z.object({
    postId: z.string().min(1, "postId is required"),
  }),
  body: z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title is too long")
      .optional(),
    content: z.string().min(1, "Content is required").optional(),
    category: z.string().min(1, "Category is required").optional(),
    image: z.string().url("Invalid image URL").optional(),
  }),
});

// Schema for deleting a post
export const deletePostSchema = z.object({
  params: z.object({
    postId: z.string().min(1, "postId is required"),
  }),
});
