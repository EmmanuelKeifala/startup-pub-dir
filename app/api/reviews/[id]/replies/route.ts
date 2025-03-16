import db from "@/database/drizzle";
import { reviewReplies, users } from "@/database/schema";
import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: reviewId } = await params;

  // Fetch replies from the database
  const replies = await db
    .select({
      id: reviewReplies.id,
      comment: reviewReplies.replyText,
      createdAt: reviewReplies.createdAt,
      ownerId: reviewReplies.ownerId,
      name: users.fullname,
      image: users.profilePicture,
    })
    .from(reviewReplies)
    .innerJoin(users, eq(reviewReplies.ownerId, users.id))
    .where(eq(reviewReplies.reviewId, reviewId))
    .orderBy(asc(reviewReplies.createdAt));

  return NextResponse.json({ replies });
}
