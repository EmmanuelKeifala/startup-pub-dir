import React, { useEffect, useState } from "react";
import { ReplyType, Review } from "./StartUpReview";
import ReplyItem from "./ReplyItem";
import ReplyInput from "./ReplyInput";
import {
  Flag,
  Reply,
  Star,
  ThumbsUp,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface ReviewItemProps {
  review: Review;
  currentUserId: string;
  companyColors: string;
}

function ReviewItem({
  review,
  currentUserId,
  companyColors = "",
}: ReviewItemProps) {
  const { id, userId, rating, comment, createdAt, image, name } = review;
  const accentColor = companyColors?.split(",")[0] || "#FFCA28";
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(review.likeCount || 0);
  const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
  const [replies, setReplies] = useState<ReplyType[]>([]);
  const [repliesHidden, setRepliesHidden] = useState<boolean>(false);

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
    fetchReplies();
  };

  const toggleRepliesVisibility = () => {
    setRepliesHidden(!repliesHidden);
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
            liked ? "text-blue-400" : "text-slate-300"
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
        <>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
            </p>
            <button
              onClick={toggleRepliesVisibility}
              className="text-gray-400 hover:text-gray-300 flex items-center text-xs"
            >
              {repliesHidden ? (
                <>
                  <ChevronDown size={14} className="mr-1" />
                  Show Replies
                </>
              ) : (
                <>
                  <ChevronUp size={14} className="mr-1" />
                  Hide Replies
                </>
              )}
            </button>
          </div>

          {!repliesHidden && (
            <div className="mt-2">
              {replies.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ReviewItem;
