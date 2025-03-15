import React from "react";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import db from "@/database/drizzle";
import { startupCategories, startups } from "@/database/schema";
import { StartUpOverview } from "@/components/app-components";
import StartUpVideo from "@/components/app-components/StartUpVideo";
import Link from "next/link";
import {
  ExternalLink,
  MapPin,
  Star,
  Activity,
  Mail,
  Phone,
} from "lucide-react";

async function StartUp({ params }: { params: { id: string } }) {
  const { id } = params;
  const session = await auth();

  // Fetch data based on id
  const [startUpDetails] = await db
    .select({
      id: startups.id,
      name: startups.name,
      description: startups.description,
      location: startups.location,
      website: startups.website,
      email: startups.email,
      phone: startups.phone,
      social: startups.social,
      logo: startups.logo,
      video: startups.video,
      companyColors: startups.companyColors,
      status: startups.status,
      rating: startups.rating,
      categoryId: startups.categoryId,
      categoryName: startupCategories.name,
    })
    .from(startups)
    .innerJoin(startupCategories, eq(startups.categoryId, startupCategories.id))
    .where(eq(startups.id, id));

  if (!startUpDetails) redirect("/404");

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl text-white">
      {/* Overview Section */}
      <StartUpOverview {...startUpDetails} />

      {/* Details Section */}
      <div className="mt-12 text-white grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Video Section */}
          {startUpDetails.video && (
            <section
              className="mb-12 rounded-xl shadow-md p-6 transition-all hover:shadow-lg"
              style={{
                background: "linear-gradient(180deg, #12141d 0%, #12151f 100%)",
              }}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <span className="mr-2">Company Video</span>
              </h3>
              <StartUpVideo videoUrl={startUpDetails.video} />
            </section>
          )}

          {/* Summary Section */}
          <section
            className="rounded-xl shadow-md p-6 transition-all hover:shadow-lg"
            style={{
              background: "linear-gradient(180deg, #12141d 0%, #12151f 100%)",
            }}
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <span>Summary</span>
            </h3>
            <div className="space-y-5 text-lg">
              {startUpDetails.description.split("\n").map((line, i) => (
                <p key={i} className="leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div
            className="rounded-xl shadow-md p-6 sticky top-6 transition-all hover:shadow-lg"
            style={{
              background: "linear-gradient(180deg, #12141d 0%, #12151f 100%)",
            }}
          >
            <h3 className="text-2xl font-bold mb-6">Company Details</h3>
            <div className="space-y-6">
              {startUpDetails.location && (
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mt-1 mr-3 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-300">Location</h4>
                    <p className="text-white">{startUpDetails.location}</p>
                  </div>
                </div>
              )}

              {startUpDetails.website && (
                <div className="flex items-start">
                  <ExternalLink className="w-5 h-5 mt-1 mr-3 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-300">Website</h4>
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
                <div className="flex items-start">
                  <Mail className="w-5 h-5 mt-1 mr-3 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-300">Email</h4>
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
                <div className="flex items-start">
                  <Phone className="w-5 h-5 mt-1 mr-3 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-300">Phone</h4>
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
                <div className="flex items-start">
                  <div className="w-5 h-5 mt-1 mr-3 text-gray-400">#</div>
                  <div>
                    <h4 className="font-medium text-gray-300">Social</h4>
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
                              className="text-blue-400 hover:text-blue-300 transition-colors hover:underline block"
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
                <div className="flex items-start">
                  <Star className="w-5 h-5 mt-1 mr-3 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-300">Rating</h4>
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
                <div className="flex items-start">
                  <Activity className="w-5 h-5 mt-1 mr-3 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-300">Status</h4>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        startUpDetails.status === "approved"
                          ? "bg-green-900 text-green-200"
                          : startUpDetails.status === "pending"
                          ? "bg-yellow-900 text-yellow-200"
                          : "bg-gray-800 text-gray-200"
                      }`}
                    >
                      {startUpDetails.status}
                    </span>
                  </div>
                </div>
              )}

              {startUpDetails.categoryName && (
                <div className="flex items-start">
                  <div className="w-5 h-5 mt-1 mr-3 text-gray-400">•</div>
                  <div>
                    <h4 className="font-medium text-gray-300">Category</h4>
                    <p>{startUpDetails.categoryName}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartUp;
