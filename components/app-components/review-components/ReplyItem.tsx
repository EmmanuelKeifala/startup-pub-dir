import { Avatar } from "@radix-ui/react-avatar";
import { formatDistanceToNow } from "date-fns";
import { Flag, ThumbsUp } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import { ReplyType } from "./StartUpReview";

interface ReplyItemProps {
  reply: ReplyType;
  currentUserId: string;
}
function ReplyItem({ reply, currentUserId }: ReplyItemProps) {
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
}

export default ReplyItem;
