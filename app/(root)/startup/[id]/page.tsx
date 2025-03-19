import React from "react";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import db from "@/database/drizzle";
import { reviews, startupCategories, startups, users } from "@/database/schema";
import { StartUpOverview } from "@/components/app-components";
import Link from "next/link";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import StartUpDetails, {
  StartupDetails,
} from "@/components/app-components/StartUpDetails";
import { Session } from "next-auth";

async function StartUp({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const isOwner = await db
    .select()
    .from(startups)
    .where(eq(startups.ownerId, session?.user.id as string))
    .limit(1);

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

  const initialReviews = await db
    .select({
      reviewId: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      userId: users.id,
      name: users.fullname,
      image: users.profilePicture,
      id: reviews.id,
      startupId: reviews.startupId,
    })
    .from(reviews)
    .innerJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.startupId, startUpDetails.id));

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl text-white">
      {/* Overview Section with positioned Edit button */}
      <div className="relative gap-4">
        <StartUpOverview {...startUpDetails} />

        {isOwner.length > 0 && (
          <div className="absolute ">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/50 text-blue-300 flex items-center gap-1"
            >
              <Link href={`/startup/${id}/edit`}>
                <Edit className="w-4 h-4 mr-1" />
                Edit Startup
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Details Section */}
      <StartUpDetails
        session={session as Session}
        startUpDetails={startUpDetails as StartupDetails}
        initialReviews={initialReviews}
      />
    </div>
  );
}

export default StartUp;
