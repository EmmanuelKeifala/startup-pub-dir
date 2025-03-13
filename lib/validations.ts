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
