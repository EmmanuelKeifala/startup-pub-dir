import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { StartUpOverview } from "@/components/app-components";

import StartUpDetails, {
  StartupDetails,
} from "@/components/app-components/StartUpDetails";
import { Session } from "next-auth";
import { getStartUpReviews, getStartUp } from "@/actions/helper-actions";
import { Startup } from "@/types/general";
import { getJobs } from "@/actions/jobs";
import { Job } from "@/components/app-components/JobListing";

interface StartUpProps {
  params: { id: string } | Promise<{ id: string }>;
}

async function StartUp({ params }: StartUpProps) {
  const { id } = await params;
  const session = await auth();

  const startUpDetails = await getStartUp({
    params: {
      id,
    },
  });

  const initialReviews = await getStartUpReviews({
    params: {
      id: startUpDetails?.id as string,
    },
  });

  if (!startUpDetails) redirect("/");

  const response = await getJobs(id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl text-white">
      {/* Overview Section  */}
      <div className="relative gap-4">
        <StartUpOverview {...(startUpDetails as Startup)} />
      </div>

      {/* Details Section */}
      <StartUpDetails
        session={session as Session}
        startUpDetails={startUpDetails as StartupDetails}
        initialReviews={initialReviews}
        listedJobs={response?.listedJobs as Job[]}
        jobTypes={response?.jobTypes as string[]}
        locations={response?.locations as string[]}
      />
    </div>
  );
}

export default StartUp;
