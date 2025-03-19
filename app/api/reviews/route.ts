import { auth } from "@/auth";
import db from "@/database/drizzle";
import { reviews, startups, users } from "@/database/schema";
import { and, avg, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

import Sentiment from "sentiment";

const sentiment = new Sentiment();

// Validation schema for review data
const reviewSchema = z.object({
  startupId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3).max(1000),
});

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to submit a review." },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = reviewSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { startupId, rating, comment } = validationResult.data;
    const userId = session.user.id;

    // Check if user has already reviewed this startup
    const existingReview = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.userId, userId), eq(reviews.startupId, startupId)));

    if (existingReview.length > 0) {
      return NextResponse.json(
        { error: "You have already reviewed this startup" },
        { status: 409 }
      );
    }
    const analysis = sentiment.analyze(comment);

    const sentimentLabel =
      analysis.score > 0
        ? "positive"
        : analysis.score < 0
        ? "negative"
        : "neutral";

    // Insert new review into the database
    const [newReview] = await db
      .insert(reviews)
      .values({
        userId,
        startupId,
        rating,
        comment,
        sentiment: sentimentLabel,
      })
      .returning();

    // Get user details to return with review
    const user = await db
      .select({
        id: users.id,
        name: users.fullname,
        image: users.profilePicture,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    revalidatePath(`/startup/${startupId}`);

    // Return the newly created review with user details
    return NextResponse.json(
      {
        // ...newReview,
        user:
          user.length > 0
            ? {
                id: user[0].id,
                name: user[0].name,
                avatar: user[0].image,
              }
            : null,
        likeCount: 0,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json(
      { error: "Failed to add review" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startupId = searchParams.get("startupId");

    if (!startupId) {
      return NextResponse.json(
        { error: "Missing startupId parameter" },
        { status: 400 }
      );
    }

    const reviewData = await db
      .select({
        reviewId: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        userId: users.id,
        name: users.fullname,
        image: users.profilePicture,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.startupId, startupId))
      .orderBy(desc(reviews.createdAt));

    const [{ avgRating }] = await db
      .select({ avgRating: avg(reviews.rating) })
      .from(reviews)
      .where(eq(reviews.startupId, startupId));
    const parsedAvgRating = avgRating ? Number(avgRating) : 0;

    await db
      .update(startups)
      .set({ rating: parsedAvgRating })
      .where(eq(startups.id, startupId));

    return NextResponse.json({
      success: true,
      reviews: reviewData,
    });
  } catch (error) {
    console.log("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
