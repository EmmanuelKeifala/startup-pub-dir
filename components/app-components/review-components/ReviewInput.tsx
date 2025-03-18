import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Star } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';
interface ReviewInputProps {
  startupId: string;
  userId: string;
  companyColors: string;
  onReviewAdded: () => void;
}
function ReviewInput({ startupId, companyColors = "", onReviewAdded }: ReviewInputProps) {
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
}

export default ReviewInput
