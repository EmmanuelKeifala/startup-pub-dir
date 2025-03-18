import db from "@/database/drizzle";
import { startups, reviews, reviewReplies, users } from "@/database/schema";
import { eq, desc, count, avg, sql, and, inArray } from "drizzle-orm";

export async function fetchStartupStats(startupId: string) {
  // Get base startup info
  const startup = await db
    .select()
    .from(startups)
    .where(eq(startups.id, startupId));

  if (!startup) {
    throw new Error("Startup not found");
  }

  // Get total reviews count
  const reviewsCountResult = await db
    .select({ count: count() })
    .from(reviews)
    .where(eq(reviews.startupId, startupId));

  const totalReviews = reviewsCountResult[0]?.count || 0;

  // Get average rating
  const ratingResult = await db
    .select({ average: avg(reviews.rating) })
    .from(reviews)
    .where(eq(reviews.startupId, startupId));

  const averageRating = Number(ratingResult[0]?.average || 0).toFixed(1);

  const totalViews = 1230;

  // Get pending approvals (reviews awaiting replies)
  const pendingApprovalsResult = await db
    .select({ count: count() })
    .from(reviews)
    .leftJoin(reviewReplies, eq(reviews.id, reviewReplies.reviewId))
    .where(
      and(eq(reviews.startupId, startupId), sql`${reviewReplies.id} IS NULL`)
    );

  const pendingApprovals = pendingApprovalsResult[0]?.count || 0;

  // Get latest reviews with replies
  const latestReviewsResult = await db
    .select({
      reviewId: reviews.id,
      userId: reviews.userId,
      rating: reviews.rating,
      comment: reviews.comment,
      date: reviews.createdAt,
      replyId: reviewReplies.id,
      replyText: reviewReplies.replyText,
    })
    .from(reviews)
    .leftJoin(reviewReplies, eq(reviews.id, reviewReplies.reviewId))
    .where(eq(reviews.startupId, startupId))
    .orderBy(desc(reviews.createdAt))
    .limit(5);

  // Get user information for the reviews
  const userIds = latestReviewsResult.map((review) => review.userId);

  if (userIds.length === 0) {
    return [];
  }

  const usersResult = await db
    .select({
      id: users.id,
      fullname: users.fullname,
      profilePicture: users.profilePicture,
    })
    .from(users)
    .where(inArray(users.id, userIds));
  const latestReviews = latestReviewsResult.map(
    (review: {
      userId: any;
      comment: any;
      rating: any;
      date: { toISOString: () => string };
      replyText: any;
    }) => {
      const user = usersResult.find(
        (user: { id: any }) => user.id === review.userId
      );
      return {
        user: user?.fullname || "Anonymous",
        comment: review.comment,
        rating: review.rating,
        date: review.date.toISOString().split("T")[0],
        reply: review.replyText || "",
        profilePicture: user?.profilePicture || "",
      };
    }
  );

  const historicalData = [
    { month: "Jan", views: 800, reviews: 20, rating: 4.5 },
    { month: "Feb", views: 900, reviews: 25, rating: 4.6 },
    { month: "Mar", views: 1000, reviews: 28, rating: 4.5 },
    { month: "Apr", views: 950, reviews: 30, rating: 4.6 },
    { month: "May", views: 1100, reviews: 32, rating: 4.7 },
    { month: "Jun", views: 1230, reviews: 35, rating: 4.7 },
  ];

  const sentimentAnalysis = [
    { category: "UX/UI", positive: 85, negative: 15 },
    { category: "Features", positive: 70, negative: 30 },
    { category: "Support", positive: 60, negative: 40 },
    { category: "Pricing", positive: 90, negative: 10 },
    { category: "Performance", positive: 75, negative: 25 },
  ];

  const commonKeywords = [
    "Fast service",
    "Good pricing",
    "Needs better support",
  ];

  // Calculate traffic trends
  const currentMonth = new Date().getMonth();
  const viewsThisMonth = historicalData[currentMonth]?.views || 0;
  const viewsLastMonth = historicalData[currentMonth - 1]?.views || 0;
  const increasePercentage =
    viewsLastMonth > 0
      ? Math.round(((viewsThisMonth - viewsLastMonth) / viewsLastMonth) * 100)
      : 0;

  // Calculate users who left without reviewing
  const usersLeftWithoutReview = 500;
  const usersLeftLastMonth = 525;
  const decreasePercentage =
    usersLeftLastMonth > 0
      ? Math.round(
          ((usersLeftWithoutReview - usersLeftLastMonth) / usersLeftLastMonth) *
            100
        )
      : 0;

  return {
    stats: {
      totalReviews,
      averageRating: Number(averageRating),
      totalViews,
      pendingApprovals,
    },
    latestReviews,
    performanceMetrics: {
      trafficTrends: {
        viewsThisMonth,
        increasePercentage,
        usersLeftWithoutReview,
        decreasePercentage,
      },
      commonKeywords,
      historicalData,
      sentimentAnalysis,
    },
  };
}
