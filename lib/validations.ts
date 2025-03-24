import { z } from "zod";

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
      .min(8, { message: "Password must be at least 8 characters" })
      .max(32, { message: "Password must not exceed 32 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      })
      .refine((value) => !/\s/.test(value), {
        message: "Password must not contain spaces",
      }),
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
  categoryId: z.string().uuid(),
  description: z.string().min(4, { message: "Description is required" }),
  location: z.string().min(4, { message: "Location is required" }),
  website: z.string().url(),
  contact: z.object({
    phone: z
      .string()
      .regex(/^\+232\d{7}$/, {
        message:
          "Phone must be in the format +232 followed by 7 digits (e.g., +23274400001)",
      })
      .optional()
      .or(z.literal("")),
    email: z.string().email().optional().or(z.literal("")),
    social: z.string().optional().or(z.literal("")),
  }),
  logo: z.string().url().optional().or(z.literal("")),
  video: z.string().url().optional().or(z.literal("")),
  companyColors: z.string().max(50).optional().or(z.literal("")),
});

export const jobFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().optional().or(z.literal("")),
  salary: z.string().optional().or(z.literal("")),
  jobType: z.string().optional().or(z.literal("")),
  location: z.string().min(1, "Location is required"),
  contactEmail: z.string().email("Invalid email address"),
  expiresAt: z.date().optional().or(z.literal("")),
});
