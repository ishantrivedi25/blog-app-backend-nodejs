import { z } from "zod";

export const updateUserSchema = z.object({
  params: z.object({
    userId: z.string().min(1, "userId is required"),
  }),
  body: z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username is too long")
      .optional(),
    email: z.string().email("Invalid email format").optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    profilePicture: z.string().url("Invalid profile picture URL").optional(),
  }),
});

export const deleteUserSchema = z.object({
  query: z.object({
    userId: z.string().min(1, "userId is required"),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    userId: z.string().min(1, "userId is required"),
  }),
});

export const getUsersSchema = z.object({
  query: z.object({
    startIndex: z
      .string()
      .regex(/^\d+$/, "startIndex must be a number")
      .optional(),
    limit: z.string().regex(/^\d+$/, "limit must be a number").optional(),
    sort: z.enum(["asc", "desc"]).optional(),
  }),
});
