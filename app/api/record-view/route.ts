import { NextRequest, NextResponse } from "next/server";
import db from "@/database/drizzle";
import { startupViews } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startupId = searchParams.get("startupId");
  const userId = searchParams.get("userId");

  if (!startupId) {
    return NextResponse.json({ error: "Missing startupId" }, { status: 400 });
  }

  const cookieName = userId
    ? `viewed_startup_${startupId}_user_${userId}`
    : `viewed_startup_${startupId}_anonymous`;

  const viewedCookie = request.cookies.get(cookieName);

  if (viewedCookie) {
    return NextResponse.json({ success: true, alreadyViewed: true });
  }

  try {
    if (userId) {
      const existingView = await db
        .select()
        .from(startupViews)
        .where(eq(startupViews.userId, userId))
        .limit(1);

      if (existingView.length > 0) {
        const response = NextResponse.json({
          success: true,
          alreadyViewed: true,
        });
        response.cookies.set(cookieName, "true", {
          maxAge: 60 * 60 * 24 * 1,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
        });
        return response;
      }
    }

    await db.insert(startupViews).values({
      startupId,
      userId: userId || null,
      viewedAt: new Date(),
    });

    const response = NextResponse.json({ success: true, newView: true });

    response.cookies.set(cookieName, "true", {
      maxAge: 60 * 60 * 24 * 1,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Failed to record view:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record view" },
      { status: 500 }
    );
  }
}
