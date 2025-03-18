import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Reply } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
interface ReplyInputProps {
  reviewId: string;
  onReplyAdded: () => void;
  onCancel: () => void;
}

function ReplyInput({ reviewId, onReplyAdded, onCancel }: ReplyInputProps) {
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { data: session } = useSession();

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

  console.log(session?.user);

  return (
    <div className="mt-2 pl-12">
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8">
          <div className="bg-gray-700 h-full w-full flex items-center justify-center text-white text-xs">
            <Image
              src={session?.user.profilePicture as string}
              alt={"user image"}
              width={10000}
              height={10000}
            />
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
          <div className="flex justify-end gap-2 mt-2 text-slate-800">
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
}

export default ReplyInput;
