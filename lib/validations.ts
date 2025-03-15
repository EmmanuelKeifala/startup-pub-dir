import { z } from "zod";

// TODO: when done with core features might add investor mode
export const signUpSchema = z
  .object({
    fullName: z.string().min(4, { message: "Full name is required" }),
    role: z.enum(["startup_owner", "user"], {
      required_error: "Role is required",
    }),
    profilePicture: z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const registerStartUpSchema = z.object({
  name: z.string().min(4, { message: "Name is required" }),
  categoryId: z.string().uuid().optional(),
  description: z.string().min(4, { message: "Description is required" }),
  location: z.string().min(4, { message: "Location is required" }),
  website: z.string().url().optional(),
  contact: z.object({
    phone: z.string().max(20).optional(),
    email: z.string().email().optional(),
    social: z.string().optional(),
  }),
  rating: z.number().int().min(0).max(5).optional().default(0),
  logo: z.string().url().optional(),
  video: z.string().url().optional(),
  companyColors: z.string().max(50).optional(), // Matches DB `varchar(50)`
  status: z
    .enum(["pending", "approved", "rejected"])
    .optional()
    .default("pending"),
});
