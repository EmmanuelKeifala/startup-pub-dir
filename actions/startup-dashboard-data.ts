import db from "@/database/drizzle";
import {
  startups,
  reviews,
  reviewReplies,
  users,
  startupViews,
} from "@/database/schema";
import { eq, desc, count, avg, sql, and, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function fetchStartupStats(startupId: string) {
  // Get base startup info
  const startup = await db
    .select()
    .from(startups)
    .where(eq(startups.id, startupId));

  if (!startup.length) {
    redirect("/");
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

  // Get actual view count
  const viewsCountResult = await db
    .select({ count: count() })
    .from(startupViews)
    .where(eq(startupViews.startupId, startupId));

  const totalViews = viewsCountResult[0]?.count || 0;

  const pendingApprovalsResult = await db
    .select({ count: count() })
    .from(startups)
    .where(eq(startups.status, "pending"));

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

  const usersResult =
    userIds.length > 0
      ? await db
          .select({
            id: users.id,
            fullname: users.fullname,
            profilePicture: users.profilePicture,
          })
          .from(users)
          .where(inArray(users.id, userIds))
      : [];

  const latestReviews = latestReviewsResult.map((review) => {
    const user = usersResult.find((user) => user.id === review.userId);
    return {
      user: user?.fullname || "Anonymous",
      comment: review.comment,
      rating: review.rating,
      date: review.date.toISOString().split("T")[0],
      reply: review.replyText || "",
      profilePicture: user?.profilePicture || "",
    };
  });

  // Get historical view data (last 6 months)
  const lastSixMonths = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    lastSixMonths.push({
      monthDate: month,
      monthName: month.toLocaleString("default", { month: "short" }),
    });
  }

  // Get historical view data
  const historicalViewsResult = await Promise.all(
    lastSixMonths.map(async ({ monthDate, monthName }) => {
      const startOfMonth = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

      const viewsResult = await db
        .select({ count: count() })
        .from(startupViews)
        .where(
          and(
            eq(startupViews.startupId, startupId),
            sql`${startupViews.viewedAt} >= ${startOfMonth.toISOString()}`,
            sql`${startupViews.viewedAt} <= ${endOfMonth.toISOString()}`
          )
        );

      const reviewsResult = await db
        .select({ count: count() })
        .from(reviews)
        .where(
          and(
            eq(reviews.startupId, startupId),
            sql`${reviews.createdAt} >= ${startOfMonth.toISOString()}`,
            sql`${reviews.createdAt} <= ${endOfMonth.toISOString()}`
          )
        );

      const ratingResult = await db
        .select({ average: avg(reviews.rating) })
        .from(reviews)
        .where(
          and(
            eq(reviews.startupId, startupId),
            sql`${reviews.createdAt} >= ${startOfMonth.toISOString()}`,
            sql`${reviews.createdAt} <= ${endOfMonth.toISOString()}`
          )
        );

      return {
        month: monthName,
        views: viewsResult[0]?.count || 0,
        reviews: reviewsResult[0]?.count || 0,
        rating: Number(ratingResult[0]?.average || 0).toFixed(1),
      };
    })
  );

  // Calculate traffic trends
  const currentMonthViews = historicalViewsResult[5]?.views || 0;
  const previousMonthViews = historicalViewsResult[4]?.views || 0;
  const increasePercentage =
    previousMonthViews > 0
      ? Math.round(
          ((currentMonthViews - previousMonthViews) / previousMonthViews) * 100
        )
      : 0;

  // Calculate users who left without reviewing
  const usersLeftWithoutReview = Math.max(
    0,
    currentMonthViews - (historicalViewsResult[5]?.reviews || 0)
  );
  const usersLeftLastMonth = Math.max(
    0,
    previousMonthViews - (historicalViewsResult[4]?.reviews || 0)
  );
  const decreasePercentage =
    usersLeftLastMonth > 0
      ? Math.round(
          ((usersLeftWithoutReview - usersLeftLastMonth) / usersLeftLastMonth) *
            100
        )
      : 0;

  // Fetch sentiment data from reviews
  const sentimentData = await db
    .select({
      sentiment: reviews.sentiment,
      count: count(),
    })
    .from(reviews)
    .where(eq(reviews.startupId, startupId))
    .groupBy(reviews.sentiment);

  // Aggregate sentiment data into negative, positive, and neutral
  const sentimentAnalysis = {
    positive: 0,
    negative: 0,
    neutral: 0,
  };

  sentimentData.forEach(({ sentiment, count }) => {
    if (sentiment === "positive") {
      sentimentAnalysis.positive += count || 0;
    } else if (sentiment === "negative") {
      sentimentAnalysis.negative += count || 0;
    } else {
      sentimentAnalysis.neutral += count || 0;
    }
  });

  // Calculate percentages
  const totalSentimentReviews =
    sentimentAnalysis.positive +
    sentimentAnalysis.negative +
    sentimentAnalysis.neutral;

  if (totalSentimentReviews > 0) {
    sentimentAnalysis.positive = Math.round(
      (sentimentAnalysis.positive / totalSentimentReviews) * 100
    );
    sentimentAnalysis.negative = Math.round(
      (sentimentAnalysis.negative / totalSentimentReviews) * 100
    );
    sentimentAnalysis.neutral = Math.round(
      (sentimentAnalysis.neutral / totalSentimentReviews) * 100
    );
  }

  // Placeholder for common keywords - TODO: implement keyword extraction
  const commonKeywords = [""];

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
        viewsThisMonth: currentMonthViews,
        increasePercentage,
        usersLeftWithoutReview,
        decreasePercentage,
      },
      commonKeywords,
      historicalData: historicalViewsResult,
      sentimentAnalysis,
    },
  };
}

export async function fetchAdminDashboardData() {
  // Fetch all startups
  const allStartups = await db.select().from(startups);

  if (!allStartups.length) {
    throw new Error("No startups found");
  }

  // Get total startups count
  const totalStartups = allStartups.length;

  // Get total reviews count across all startups
  const reviewsCountResult = await db.select({ count: count() }).from(reviews);

  const totalReviews = reviewsCountResult[0]?.count || 0;

  // Get average rating across all startups
  const ratingResult = await db
    .select({ average: avg(reviews.rating) })
    .from(reviews);

  const averageRating = Number(ratingResult[0]?.average || 0).toFixed(1);

  // Get total views across all startups
  const viewsCountResult = await db
    .select({ count: count() })
    .from(startupViews);

  const totalViews = viewsCountResult[0]?.count || 0;

  // Get pending approvals (reviews awaiting replies) across all startups
  const pendingApprovalsResult = await db
    .select({ count: count() })
    .from(startups)
    .where(eq(startups.status, "pending"));

  const pendingApprovals = pendingApprovalsResult[0]?.count || 0;

  // Get latest reviews across all startups
  const latestReviewsResult = await db
    .select({
      reviewId: reviews.id,
      userId: reviews.userId,
      rating: reviews.rating,
      comment: reviews.comment,
      date: reviews.createdAt,
      replyId: reviewReplies.id,
      replyText: reviewReplies.replyText,
      startupId: reviews.startupId,
    })
    .from(reviews)
    .leftJoin(reviewReplies, eq(reviews.id, reviewReplies.reviewId))
    .orderBy(desc(reviews.createdAt))
    .limit(10); // Limit to 10 latest reviews

  // Get user information for the reviews
  const userIds = latestReviewsResult.map((review) => review.userId);

  const usersResult =
    userIds.length > 0
      ? await db
          .select({
            id: users.id,
            fullname: users.fullname,
            profilePicture: users.profilePicture,
          })
          .from(users)
          .where(inArray(users.id, userIds))
      : [];

  // Map reviews with user information
  const latestReviews = latestReviewsResult.map((review) => {
    const user = usersResult.find((user) => user.id === review.userId);
    return {
      user: user?.fullname || "Anonymous",
      comment: review.comment,
      rating: review.rating,
      date: review.date.toISOString().split("T")[0],
      reply: review.replyText || "",
      profilePicture: user?.profilePicture || "",
    };
  });

  // Get historical view data (last 6 months) across all startups
  const lastSixMonths = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    lastSixMonths.push({
      monthDate: month,
      monthName: month.toLocaleString("default", { month: "short" }),
    });
  }

  // Get historical view data across all startups
  const historicalViewsResult = await Promise.all(
    lastSixMonths.map(async ({ monthDate, monthName }) => {
      const startOfMonth = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1
      );
      const endOfMonth = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

      const viewsResult = await db
        .select({ count: count() })
        .from(startupViews)
        .where(
          and(
            sql`${startupViews.viewedAt} >= ${startOfMonth.toISOString()}`,
            sql`${startupViews.viewedAt} <= ${endOfMonth.toISOString()}`
          )
        );

      const reviewsResult = await db
        .select({ count: count() })
        .from(reviews)
        .where(
          and(
            sql`${reviews.createdAt} >= ${startOfMonth.toISOString()}`,
            sql`${reviews.createdAt} <= ${endOfMonth.toISOString()}`
          )
        );

      const ratingResult = await db
        .select({ average: avg(reviews.rating) })
        .from(reviews)
        .where(
          and(
            sql`${reviews.createdAt} >= ${startOfMonth.toISOString()}`,
            sql`${reviews.createdAt} <= ${endOfMonth.toISOString()}`
          )
        );

      return {
        month: monthName,
        totalViews: viewsResult[0]?.count || 0,
        totalReviews: reviewsResult[0]?.count || 0,
        averageRating: Number(ratingResult[0]?.average || 0).toFixed(1),
      };
    })
  );
  // Calculate traffic trends across all startups
  const currentMonthViews = historicalViewsResult[5]?.totalViews || 0;
  const previousMonthViews = historicalViewsResult[4]?.totalViews || 0;
  const increasePercentage =
    previousMonthViews > 0
      ? Math.round(
          ((currentMonthViews - previousMonthViews) / previousMonthViews) * 100
        )
      : 0;

  // Calculate users who left without reviewing across all startups
  const usersLeftWithoutReview = Math.max(
    0,
    currentMonthViews - (historicalViewsResult[5]?.totalReviews || 0)
  );
  const usersLeftLastMonth = Math.max(
    0,
    previousMonthViews - (historicalViewsResult[4]?.totalReviews || 0)
  );
  const decreasePercentage =
    usersLeftLastMonth > 0
      ? Math.round(
          ((usersLeftWithoutReview - usersLeftLastMonth) / usersLeftLastMonth) *
            100
        )
      : 0;

  // Fetch sentiment data from reviews across all startups
  const sentimentData = await db
    .select({
      sentiment: reviews.sentiment,
      count: count(),
    })
    .from(reviews)
    .groupBy(reviews.sentiment);

  // Aggregate sentiment data into negative, positive, and neutral
  const rawSentimentCounts = {
    positive: 0,
    negative: 0,
    neutral: 0,
  };

  sentimentData.forEach(({ sentiment, count }) => {
    if (sentiment === "positive") {
      rawSentimentCounts.positive += count || 0;
    } else if (sentiment === "negative") {
      rawSentimentCounts.negative += count || 0;
    } else {
      rawSentimentCounts.neutral += count || 0;
    }
  });

  // Common keywords - TODO: implement keyword extraction
  const commonKeywords = [""];

  return {
    stats: {
      totalStartups,
      totalReviews,
      averageRating: Number(averageRating),
      totalViews,
      pendingApprovals,
    },
    latestReviews,
    performanceMetrics: {
      trafficTrends: {
        totalViewsThisMonth: currentMonthViews,
        averageIncreasePercentage: increasePercentage,
        totalUsersLeftWithoutReview: usersLeftWithoutReview,
        averageDecreasePercentage: decreasePercentage,
      },
      commonKeywords,
      historicalData: historicalViewsResult.map((item) => ({
        month: item.month,
        totalViews: item.totalViews,
        totalReviews: item.totalReviews,
        averageRating: Number(item.averageRating),
      })),
      sentimentAnalysis: {
        totalPositive: rawSentimentCounts.positive,
        totalNegative: rawSentimentCounts.negative,
        totalNeutral: rawSentimentCounts.neutral,
      },
    },
  };
}
