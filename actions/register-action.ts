"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { registerStartUpSchema } from "@/lib/validations";
import { auth } from "@/auth";
import db from "@/database/drizzle";
import { startups, users } from "@/database/schema";
import { eq } from "drizzle-orm";

type FormDataTypes = {
  name: string;
  categoryId: string;
  description: string;
  location: string;
  website: string;
  phone: string;
  email: string;
  social: string;
  logo: string;
  video: string;
  companyColors: string;
};

export async function registerStartUp(formData: FormDataTypes) {
  const {
    categoryId,
    companyColors,
    description,
    email,
    location,
    logo,
    name,
    phone,
    social,
    video,
    website,
  } = formData;
  // Get the current user session
  const session = await auth();

  if (!session?.user) {
    return {
      success: false,
      error: "You must be logged in to register a startup",
    };
  }

  if (session?.user?.role !== "startup_owner") {
    return {
      success: false,
      error: "You are not logged in as an owner",
    };
  }

  const userExist = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (userExist.length < 0) {
    return { success: false, error: "User not found" };
  }

  const startUpExistForUser = await db
    .select()
    .from(startups)
    .where(eq(startups.ownerId, userExist[0].id))
    .limit(1);
  if (startUpExistForUser.length > 0) {
    return { success: false, error: "You already have a startup" };
  }

  try {
    await db.insert(startups).values({
      name,
      categoryId: categoryId ? categoryId : null,
      description,
      location,
      website,
      contact: {
        phone,
        email,
        social,
      },
      logo,
      video,
      colors: {
        primaryColor: companyColors,
        secondaryColor: companyColors,
      },
      ownerId: userExist[0].id,
    });

    revalidatePath("/startups");
    return { success: true };
  } catch (error) {}
}
