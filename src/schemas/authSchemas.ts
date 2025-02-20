import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .trim(),
    email: z
      .string()
      .email("Invalid email address")
      .toLowerCase() // Sanitize: convert to lowercase
      .trim(), // Sanitize: remove leading/trailing spaces
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password must be at most 20 characters")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
  }),
});

export const signinSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email format")
      .toLowerCase() // Sanitize: convert to lowercase
      .trim(), // Sanitize: remove leading/trailing spaces
    password: z.string(),
  }),
});

export const googleAuthSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    name: z.string().min(1, "Name is required"),
    googlePhotoUrl: z.string().url("Invalid URL format").optional(),
  }),
});
