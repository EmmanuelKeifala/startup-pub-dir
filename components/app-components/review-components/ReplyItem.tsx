import { Avatar } from "@radix-ui/react-avatar";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import React from "react";
import { ReplyType } from "./StartUpReview";

interface ReplyItemProps {
  reply: ReplyType;
  currentUserId: string;
}
function ReplyItem({ reply }: ReplyItemProps) {
  const { comment, createdAt, image, name } = reply;

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

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
        </div>
      </div>
    </div>
  );
}

export default ReplyItem;
