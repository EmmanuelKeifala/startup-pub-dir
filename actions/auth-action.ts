"use server";

import db from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

type AuthCredentials = {
  email: string;
  password: string;
  fullName: string;
  profilePicture: string;
  role: "admin" | "startup_owner" | "user";
};


export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password">
) => {
  const { email, password } = params;
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.log("[SIGN_IN_ERROR]: ", error);
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { email, password, fullName, profilePicture, role } = params;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existingUser.length > 0) {
    return { success: false, error: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.insert(users).values({
      fullname: fullName,
      email,
      password: hashedPassword,
      profilePicture,
      role,
    });

    await signInWithCredentials({ email, password });

    return { success: true };
  } catch (error) {
    console.log("[SIGN_UP_ERROR]: ", error);
  }
};
