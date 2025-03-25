
import { NextResponse } from "next/server";
import { profileFormSchema } from "@/lib/validations";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import db from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in to update your profile" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const payload = profileFormSchema.parse(body);

    const updateData: {
      name?: string;
      email?: string;
      image?: string;
      password?: string;
    } = {
      name: payload.name,
      email: payload.email,
      image: payload.avatar,
    };

    if (payload.newPassword) {
      const currentUser = await db
        .select({
          password: users.password,
        })
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1);

      if (!currentUser[0].password) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      const isValid = await bcrypt.compare(
        payload?.currentPassword as string,
        currentUser[0].password
      );

      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(payload.newPassword, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await db
      .update(users)
      .set({
        ...updateData,
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "This email is already in use" },
        { status: 400 }
      );
    }

    console.error("[PROFILE_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
