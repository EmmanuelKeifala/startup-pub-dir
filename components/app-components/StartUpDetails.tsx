"use client";
import React, { useEffect, useState } from "react";
import {
  ExternalLink,
  Star,
  Activity,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
  Play,
  Users,
} from "lucide-react";
import Link from "next/link";
import StartUpVideo from "@/components/app-components/StartUpVideo";
import StartupReviews, {
  Review,
} from "@/components/app-components/review-components/StartUpReview";
import { Session } from "next-auth";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Type definition for startup details
export type StartupDetails = {
  id: string;
  name: string;
  description: string;
  location: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  social: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  } | null;
  logo: string | null;
  video: string | null;
  companyColors: {
    primary?: string;
    secondary?: string;
    accent?: string;
  } | null;
  status: string | null;
  rating: number | null;
  categoryId: string;
  categoryName: string;
};

// Type definition for reviews
export type ReviewDetails = {
  reviewId: string;
  id: string; // Duplicate of reviewId, consider using just one
  rating: number;
  comment: string | null;
  createdAt: Date;
  userId: string;
  name: string | null;
  image: string | null;
  startupId: string;
};

// For the query results
export type StartupQueryResult = StartupDetails;
export type ReviewQueryResult = ReviewDetails[];

function StartUpDetails({
  startUpDetails,
  initialReviews,
  session,
}: {
  startUpDetails: StartupQueryResult;
  initialReviews?: ReviewQueryResult;
  session: Session;
}) {
  const [expanded, setExpanded] = useState(false);

  // Process the description to create a shortened version
  const fullDescription = startUpDetails.description;
  const paragraphs = fullDescription.split("\n");
  const shortDescription =
    paragraphs.length > 2
      ? paragraphs.slice(0, 2).join("\n")
      : paragraphs[0].length > 300
      ? paragraphs[0].substring(0, 300) + "..."
      : fullDescription;

  const shouldShowReadMore =
    paragraphs.length > 2 || paragraphs[0].length > 300;

  const accentColor = startUpDetails.companyColors?.primary || "#6366F1";

  // Create a gradient style based on company colors
  const gradientStyle = {
    background: `linear-gradient(135deg, ${accentColor}22 0%, #12141d 50%, #12151f 100%)`,
    borderLeft: `3px solid ${accentColor}`,
  };

  useEffect(() => {
    fetch(
      `/api/record-view?startupId=${startUpDetails.id}${
        session?.user?.id ? `&userId=${session.user.id}` : ""
      }`
    );
  }, [startUpDetails.id, session?.user?.id]);

  return (
    <div className="mt-12 text-white grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Video Section */}
        {startUpDetails.video && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl shadow-xl overflow-hidden backdrop-blur-sm"
            style={gradientStyle}
          >
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Play className="mr-2 text-white/70" />
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Company Video
                </span>
              </h3>
              <div className="rounded-lg overflow-hidden">
                <StartUpVideo videoUrl={startUpDetails.video} />
              </div>
            </div>
          </motion.section>
        )}

        {/* Summary Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-xl shadow-xl overflow-hidden backdrop-blur-sm"
          style={gradientStyle}
        >
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Users className="mr-2 text-white/70" />
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Summary
              </span>
            </h3>
            <div className="space-y-5 text-lg">
              {(expanded ? paragraphs : shortDescription.split("\n")).map(
                (line, i) => (
                  <p key={i} className="leading-relaxed text-gray-300">
                    {line}
                  </p>
                )
              )}

              {shouldShowReadMore && (
                <Button
                  onClick={() => setExpanded(!expanded)}
                  variant="ghost"
                  className="mt-4 flex items-center gap-2 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  {expanded ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span>Read Less</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span>Read More</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </motion.section>
      </div>

      {/* Sidebar */}
      <motion.div
        className="lg:col-span-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div
          className="rounded-xl shadow-xl p-6 sticky top-6 backdrop-blur-sm"
          style={gradientStyle}
        >
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Company Details
          </h3>
          <div className="space-y-6">
            {startUpDetails.location && (
              <div className="flex items-start group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-all">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <div className="ml-3 mt-1">
                  <h4 className="font-medium text-gray-400">Location</h4>
                  <p className="text-white">{startUpDetails.location}</p>
                </div>
              </div>
            )}

            {startUpDetails.website && (
              <div className="flex items-start group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-all">
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </div>
                <div className="ml-3 mt-1">
                  <h4 className="font-medium text-gray-400">Website</h4>
                  <Link
                    href={startUpDetails.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors hover:underline flex items-center"
                  >
                    {startUpDetails.website}
                  </Link>
                </div>
              </div>
            )}

            {startUpDetails.email && (
              <div className="flex items-start group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-all">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <div className="ml-3 mt-1">
                  <h4 className="font-medium text-gray-400">Email</h4>
                  <Link
                    href={`mailto:${startUpDetails.email}`}
                    className="text-blue-400 hover:text-blue-300 transition-colors hover:underline"
                  >
                    {startUpDetails.email}
                  </Link>
                </div>
              </div>
            )}

            {startUpDetails.phone && (
              <div className="flex items-start group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-all">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <div className="ml-3 mt-1">
                  <h4 className="font-medium text-gray-400">Phone</h4>
                  <Link
                    href={`tel:${startUpDetails.phone}`}
                    className="text-blue-400 hover:text-blue-300 transition-colors hover:underline"
                  >
                    {startUpDetails.phone}
                  </Link>
                </div>
              </div>
            )}

            {startUpDetails.social && (
              <div className="flex items-start group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-all">
                  <div className="text-gray-400 font-bold">#</div>
                </div>
                <div className="ml-3 mt-1">
                  <h4 className="font-medium text-gray-400">Social</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {typeof startUpDetails.social === "object" &&
                    startUpDetails.social !== null ? (
                      Object.entries(startUpDetails.social).map(
                        ([platform, url]) => (
                          <Link
                            key={platform}
                            href={String(url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-blue-400 hover:text-blue-300 transition-all text-sm"
                          >
                            {platform}
                          </Link>
                        )
                      )
                    ) : (
                      <span>{String(startUpDetails.social)}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {startUpDetails.rating && (
              <div className="flex items-start group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-all">
                  <Star className="w-5 h-5 text-gray-400" />
                </div>
                <div className="ml-3 mt-1">
                  <h4 className="font-medium text-gray-400">Rating</h4>
                  <div className="flex items-center">
                    <span className="text-yellow-400 text-lg font-medium">
                      {startUpDetails.rating}
                    </span>
                    <div className="ml-2 flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(Number(startUpDetails.rating))
                              ? "text-yellow-400 fill-yellow-400"
                              : i < Number(startUpDetails.rating) &&
                                Number(startUpDetails.rating) % 1 !== 0
                              ? "text-yellow-400 fill-yellow-400 opacity-50"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {startUpDetails.status && (
              <div className="flex items-start group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-all">
                  <Activity className="w-5 h-5 text-gray-400" />
                </div>
                <div className="ml-3 mt-1">
                  <h4 className="font-medium text-gray-400">Status</h4>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                      ${
                        startUpDetails.status === "approved"
                          ? "bg-green-900/50 text-green-200"
                          : startUpDetails.status === "pending"
                          ? "bg-yellow-900/50 text-yellow-200"
                          : "bg-gray-800/50 text-gray-200"
                      }`}
                  >
                    {startUpDetails.status}
                  </span>
                </div>
              </div>
            )}

            {startUpDetails.categoryName && (
              <div className="flex items-start group">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-all">
                  <div className="text-gray-400 font-bold">•</div>
                </div>
                <div className="ml-3 mt-1">
                  <h4 className="font-medium text-gray-400">Category</h4>
                  <span className="px-3 py-1 bg-white/5 rounded-full text-sm">
                    {startUpDetails.categoryName}
                  </span>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/10">
              <StartupReviews
                companyColors=""
                currentUserId={session?.user?.id as string}
                initialReviews={initialReviews as Review[]}
                startupId={startUpDetails.id}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default StartUpDetails;
