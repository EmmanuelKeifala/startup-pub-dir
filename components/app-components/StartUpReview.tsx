"use client";
// TODO: Refactor this into separate components
import React, { useState, useEffect } from "react";
import { Star, Send, ThumbsUp, Flag, Loader2, Reply } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import Image from "next/image";

// Type definitions for better type safety
interface User {
  id: string;
  name?: string;
  avatar?: string;
  image?: string;
}

interface ReplyType {
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

interface ReviewInputProps {
  startupId: string;
  userId: string;
  companyColors: string;
  onReviewAdded: () => void;
}

const ReviewInput: React.FC<ReviewInputProps> = ({
  startupId,
  userId,
  companyColors = "",
  onReviewAdded,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const accentColor = companyColors?.split(",")[0] || "#FFCA28";
  const maxRating = 5;

  const handleSubmit = async () => {
    // Validate input
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (comment.trim().length < 3) {
      toast.error("Please write a comment (minimum 3 characters)");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment,
          rating,
          startupId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Thanks for your review");
        // Reset form
        setRating(0);
        setComment("");
        // Notify parent to refresh reviews
        onReviewAdded();
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="rounded-lg shadow-md p-4 mb-6"
      style={{
        background: "linear-gradient(180deg, #22191d 0%, #12151f 100%)",
      }}
    >
      <h3 className="text-lg font-medium mb-4">Write a Review</h3>

      {/* Star rating input */}
      <div className="mb-4">
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(maxRating)].map((_, index) => {
            const starValue = index + 1;
            return (
              <button
                key={index.toString() + 2}
                type="button"
                className="focus:outline-none transition-colors duration-200"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoveredRating(starValue)}
                onMouseLeave={() => setHoveredRating(0)}
                disabled={isSubmitting}
              >
                <Star
                  size={24}
                  fill={
                    (hoveredRating || rating) >= starValue
                      ? accentColor
                      : "transparent"
                  }
                  color={
                    (hoveredRating || rating) >= starValue
                      ? accentColor
                      : "#D1D5DB"
                  }
                  strokeWidth={1.5}
                />
              </button>
            );
          })}
          <span className="ml-2 text-sm text-gray-500">
            {rating > 0
              ? `${rating} star${rating !== 1 ? "s" : ""}`
              : "Select a rating"}
          </span>
        </div>
      </div>

      {/* Comment input */}
      <div className="mb-4">
        <Textarea
          placeholder="Share your experience with this startup..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full resize-none"
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          className="flex items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </div>
  );
};

// New Reply Input Component
interface ReplyInputProps {
  reviewId: string;
  onReplyAdded: () => void;
  onCancel: () => void;
}

const ReplyInput: React.FC<ReplyInputProps> = ({
  reviewId,
  onReplyAdded,
  onCancel,
}) => {
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    // Validate input
    if (comment.trim().length < 3) {
      toast.error("Please write a reply (minimum 3 characters)");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews/replies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          replyText: comment,
          reviewId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Reply posted successfully");
        // Reset form
        setComment("");
        // Notify parent to refresh reviews
        onReplyAdded();
      } else {
        toast.error(data.error || "Failed to submit reply");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-2 pl-12">
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8">
          <div className="bg-gray-700 h-full w-full flex items-center justify-center text-white text-xs">
            U
          </div>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Add a reply..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full resize-none bg-gray-800 border-gray-700"
            rows={2}
            disabled={isSubmitting}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              className="flex items-center gap-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Reply size={14} />
              )}
              {isSubmitting ? "Posting..." : "Reply"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reply Item Component
interface ReplyItemProps {
  reply: ReplyType;
  currentUserId: string;
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, currentUserId }) => {
  const { userId, comment, createdAt, image, name } = reply;
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(reply.likeCount || 0);

  const isCurrentUserReply = userId === currentUserId;
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  const handleLike = () => {
    if (!liked) {
      setLikeCount(likeCount + 1);
      setLiked(true);
      // TODO: Add API call to update likes
    } else {
      setLikeCount(likeCount - 1);
      setLiked(false);
      // TODO: Add API call to update likes
    }
  };

  const handleReport = () => {
    toast("Report functionality coming soon");
    // TODO: Implement report functionality
  };

  const userAvatar = image;
  const userName = name || "Anonymous User";

  return (
    <div className="pl-12 mt-3">
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8">
          {userAvatar ? (
            <Image
              src={userAvatar}
              alt={userName}
              width={10000}
              height={10000}
            />
          ) : (
            <div className="bg-gray-700 h-full w-full flex items-center justify-center text-white text-xs">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center">
            <h5 className="font-medium text-sm">{userName}</h5>
            <span className="mx-2 text-xs text-gray-400">•</span>
            <p className="text-xs text-gray-400">{timeAgo}</p>
          </div>
          <p className="text-sm text-gray-300 mt-1">{comment}</p>
          <div className="mt-2 flex items-center gap-4 text-xs">
            <button
              className={`flex items-center gap-1 ${
                liked ? "text-blue-400" : "text-gray-400"
              }`}
              onClick={handleLike}
            >
              <ThumbsUp size={12} />
              <span>{likeCount > 0 ? likeCount : ""} Helpful</span>
            </button>

            {!isCurrentUserReply && (
              <button
                className="text-gray-400 flex items-center gap-1"
                onClick={handleReport}
              >
                <Flag size={12} />
                Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewItem: React.FC<{
  review: Review;
  currentUserId: string;
  companyColors: string;
}> = ({ review, currentUserId, companyColors = "" }) => {
  const { id, userId, rating, comment, createdAt, image, name } = review;
  const accentColor = companyColors?.split(",")[0] || "#FFCA28";
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(review.likeCount || 0);
  const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
  const [replies, setReplies] = useState<ReplyType[]>([]);

  const isCurrentUserReview = userId === currentUserId;
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  const handleLike = () => {
    if (!liked) {
      setLikeCount(likeCount + 1);
      setLiked(true);
      // TODO: Add API call to update likes
    } else {
      setLikeCount(likeCount - 1);
      setLiked(false);
      // TODO: Add API call to update likes
    }
  };

  const handleReport = () => {
    toast("Report functionality coming soon");
    // TODO: Implement report functionality
  };

  const handleReplyAdded = () => {
    setShowReplyInput(false);
    // TODO: Fetch replies again or add the new reply to the state
  };

  const fetchReplies = async () => {
    try {
      const response = await fetch(`/api/reviews/${id}/replies`);
      if (response.ok) {
        const data = await response.json();

        console.log("Data: ", data);
        setReplies(data.replies || []);
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [id]);

  const userAvatar = image;
  const userName = name || "Anonymous User";

  return (
    <div
      className="rounded-lg shadow-sm p-4 mb-4"
      style={{
        background: "linear-gradient(180deg, #22191d 0%, #12151f 100%)",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            {userAvatar ? (
              <Image src={userAvatar} fill alt={userName} />
            ) : (
              <div className="bg-gray-700 h-full w-full flex items-center justify-center text-white">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </Avatar>
          <div>
            <h4 className="font-medium">{userName}</h4>
            <p className="text-xs text-gray-400">{timeAgo}</p>
          </div>
        </div>

        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index.toString() + 1}
              size={16}
              fill={index < rating ? accentColor : "transparent"}
              color={index < rating ? accentColor : "#D1D5DB"}
              strokeWidth={1.5}
            />
          ))}
        </div>
      </div>

      <div className="mt-3">
        <p className="text-gray-300">{comment}</p>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <button
          className={`flex items-center gap-1 ${
            liked ? "text-blue-400" : "text-gray-400"
          }`}
          onClick={handleLike}
        >
          <ThumbsUp size={14} />
          <span>{likeCount > 0 ? likeCount : ""} Helpful</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            className="text-gray-400 flex items-center gap-1"
            onClick={() => setShowReplyInput(!showReplyInput)}
          >
            <Reply size={14} />
            Reply
          </button>

          {!isCurrentUserReview && (
            <button
              className="text-gray-400 flex items-center gap-1"
              onClick={handleReport}
            >
              <Flag size={14} />
              Report
            </button>
          )}
        </div>
      </div>

      {showReplyInput && (
        <ReplyInput
          reviewId={id}
          onReplyAdded={handleReplyAdded}
          onCancel={() => setShowReplyInput(false)}
        />
      )}

      {replies.length > 0 && (
        <div className="mt-4">
          {replies.map((reply) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface StartupReviewsProps {
  startupId: string;
  currentUserId: string;
  companyColors: string;
  initialReviews?: Review[];
}

function StartupReviews({
  startupId,
  currentUserId,
  companyColors = "",
  initialReviews = [],
}: StartupReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isLoading, setIsLoading] = useState<boolean>(!initialReviews.length);

  // Function to fetch reviews
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/reviews?startupId=${startupId}`);
      if (response.ok) {
        const data = await response.json();

        setReviews(data.reviews || []);
      } else {
        console.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch reviews on component mount if no initial reviews provided
  useEffect(() => {
    if (!initialReviews.length) {
      fetchReviews();
    }
  }, [startupId, initialReviews.length]);

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
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
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
