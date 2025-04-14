"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { registerStartUpSchema } from "@/lib/validations";
import { auth } from "@/auth";
import db from "@/database/drizzle";
import { startups, users } from "@/database/schema";
import { eq } from "drizzle-orm";

export const registerStartUp = async (
  formData: z.infer<typeof registerStartUpSchema>
) => {
  try {
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

    // Find the current user in the database
    const userExist = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email as string))
      .limit(1);

    if (userExist.length === 0) {
      return { success: false, error: "User not found" };
    }

    // Check if the user already has a startup
    const startUpExistForUser = await db
      .select()
      .from(startups)
      .where(eq(startups.ownerId, userExist[0].id))
      .limit(1);

    // TODO:  will change in production
    // if (startUpExistForUser.length > 0) {
    //   return { success: false, error: "You already have a startup" };
    // }

    const {
      name,
      categoryId,
      description,
      location,
      website,
      contact,
      logo,
      video,
      companyColors,
    } = formData;

    const colorArray = (companyColors || "")
      .split(",")
      .map((color) => color.trim())
      .filter(Boolean);
    const primaryColor = colorArray[0] || "";
    const secondaryColor = colorArray[1] || colorArray[0] || "";

    const startupResult = await db
      .insert(startups)
      .values({
        name,
        categoryId: categoryId ? categoryId : null,
        description,
        location,
        website,
        phone: contact.phone,
        email: contact.email,
        social: contact.social,
        logo,
        video,
        companyColors: `${primaryColor},${secondaryColor}`,
        ownerId: userExist[0].id,
      })
      .returning({ id: startups.id });

    revalidatePath("/");
    return { success: true, startupId: startupResult[0].id };
  } catch (error) {
    console.error("Error registering startup:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to register startup",
    };
  }
};
