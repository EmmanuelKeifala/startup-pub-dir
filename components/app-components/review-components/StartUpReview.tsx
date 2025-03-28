"use client";
import React, { useState, useEffect, useCallback } from "react";

import { ReviewInput, ReviewItem } from "./index";
import { Loader2 } from "lucide-react";

// Type definitions for better type safety
interface User {
  id: string;
  name?: string;
  avatar?: string;
  image?: string;
}

export interface ReplyType {
  id: string;
  reviewId: string;
  userId: string;
  name: string;
  image: string;
  comment: string;
  createdAt: string | Date;
  likeCount?: number;
}

export interface Review {
  id: string;
  userId: string;
  name: string;
  image: string;
  startupId: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
  user?: User;
  likeCount?: number;
}

interface StartupReviewsProps {
  startupId: string;
  currentUserId: string;
  companyColors: string;
  initialReviews?: Review[];
  maxHeight?: string;
}

function StartupReviews({
  startupId,
  currentUserId,
  companyColors = "",
  initialReviews = [],
  maxHeight = "500px", // Default max height for reviews container
}: StartupReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isLoading, setIsLoading] = useState<boolean>(!initialReviews.length);

  // Function to fetch reviews
  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reviews?startupId=${startupId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [startupId]);

  // Fetch reviews on component mount if no initial reviews provided
  useEffect(() => {
    if (!initialReviews.length) {
      fetchReviews();
    }
  }, [startupId, initialReviews.length, fetchReviews]);

  // Handle review added
  const handleReviewAdded = () => {
    fetchReviews();
  };

  return (
    <div className="startup-reviews w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Reviews</h2>

      {currentUserId && (
        <ReviewInput
          startupId={startupId}
          userId={currentUserId}
          companyColors={companyColors}
          onReviewAdded={handleReviewAdded}
        />
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4 overflow-y-auto pr-2" style={{ maxHeight }}>
          {reviews.map((review) => (
            <ReviewItem
              key={review.id as string}
              review={review}
              currentUserId={currentUserId}
              companyColors={companyColors}
            />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-8 text-gray-400"
          style={{
            background: "linear-gradient(180deg, #22191d 0%, #12151f 100%)",
            padding: "2rem",
            borderRadius: "0.5rem",
          }}
        >
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      )}
    </div>
  );
}

export default StartupReviews;
