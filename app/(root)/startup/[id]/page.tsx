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
import { getStartUpReviews, getUserStartUp } from "@/actions/helper-actions";
import { Startup } from "@/types/general";

interface StartUpProps {
  params: { id: string } | Promise<{ id: string }>;
}

async function StartUp({ params }: StartUpProps) {
  const { id } = await (params as Promise<{ id: string }>);
  const session = await auth();

  const isOwner = await db
    .select()
    .from(startups)
    .where(eq(startups.ownerId, session?.user?.id as string))
    .limit(1);

  const startUpDetails = await getUserStartUp({
    params: {
      id,
    },
  });

  const initialReviews = await getStartUpReviews({
    params: {
      id: startUpDetails?.id as string,
    },
  });

  if (!startUpDetails) redirect("/404");

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl text-white">
      {/* Overview Section with positioned Edit button */}
      <div className="relative gap-4">
        <StartUpOverview {...(startUpDetails as Startup)} />

        {isOwner.length > 0 && (
          <div className="absolute">
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
