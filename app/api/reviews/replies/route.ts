import { auth } from "@/auth";
import db from "@/database/drizzle";
import { reviewReplies } from "@/database/schema";
import { NextResponse } from "next/server";
import { z } from "zod";

const reviewSchema = z.object({
  reviewId: z.string().uuid(),
  replyText: z.string().min(3).max(1000),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to submit a reply." },
        { status: 401 }
      );
    }
    const body = await request.json();
    const validationResult = reviewSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { replyText, reviewId } = validationResult.data;
    const ownerId = session.user.id;

    const reply = await db.insert(reviewReplies).values({
      reviewId,
      replyText,
      ownerId,
    });

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.log("Error fetching replies:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch replies" },
      { status: 500 }
    );
  }
}
