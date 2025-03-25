import React, { useEffect, useState, useCallback } from "react";
import { ReplyType, Review } from "./StartUpReview";
import ReplyItem from "./ReplyItem";
import ReplyInput from "./ReplyInput";
import { Reply, Star, ChevronUp, ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

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
  const { id, rating, comment, createdAt, image, name } = review;
  const accentColor = companyColors?.split(",")[0] || "#FFCA28";
  const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
  const [replies, setReplies] = useState<ReplyType[]>([]);
  const [repliesHidden, setRepliesHidden] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  // Fix the dependency issue by using useCallback
  const fetchReplies = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/reviews/${id}/replies`);
      if (response.ok) {
        const data = await response.json();
        console.log(data.replies);
        setReplies(data.replies || []);
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const handleReplyAdded = () => {
    setShowReplyInput(false);
    fetchReplies();
  };

  const toggleRepliesVisibility = () => {
    setRepliesHidden(!repliesHidden);
  };

  useEffect(() => {
    fetchReplies();
  }, [fetchReplies]);

  const userAvatar = image;
  const userName = name || "Anonymous User";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg shadow-sm p-4 mb-4 border border-gray-800"
      style={{
        background: "linear-gradient(180deg, #22191d 0%, #12151f 100%)",
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="border border-gray-700">
            {userAvatar ? (
              <Image
                src={userAvatar}
                fill
                alt={userName}
                className="object-cover"
              />
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
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-400 hover:text-gray-200 flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-700/50 transition-colors"
            onClick={() => setShowReplyInput(!showReplyInput)}
          >
            <Reply size={14} />
            Reply
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showReplyInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ReplyInput
              reviewId={id}
              onReplyAdded={handleReplyAdded}
              onCancel={() => setShowReplyInput(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {replies.length > 0 && (
        <>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleRepliesVisibility}
              className="text-gray-400 hover:text-gray-200 flex items-center text-xs px-2 py-1 rounded-md hover:bg-gray-700/50 transition-colors"
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
            </motion.button>
          </div>

          <AnimatePresence>
            {!repliesHidden && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2 pl-4 border-l-2 border-gray-800"
              >
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-t-blue-500 border-gray-700 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  replies.map((reply, index) => (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <ReplyItem reply={reply} currentUserId={currentUserId} />
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}

export default ReviewItem;
