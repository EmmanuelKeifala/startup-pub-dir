import { NextRequest, NextResponse } from "next/server";
import db from "@/database/drizzle";
import { startupViews } from "@/database/schema";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startupId = searchParams.get("startupId");
  const userId = searchParams.get("userId");

  if (!startupId) {
    return NextResponse.json({ error: "Missing startupId" }, { status: 400 });
  }

  const hasCookie = request.cookies.has(`viewed_${startupId}`);

  if (hasCookie) {
    return NextResponse.json({ success: true, alreadyViewed: true });
  }

  try {
    await db.insert(startupViews).values({
      startupId,
      userId: userId || null,
    });

    const response = NextResponse.json({ success: true });

    // Set the cookie
    response.cookies.set(`viewed_${startupId}`, "true", {
      maxAge: 60 * 60 * 24, // 1 day
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
