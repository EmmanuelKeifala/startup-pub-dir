import { fetchStartupStats } from "@/actions/startup-dashboard-data";
import { auth } from "@/auth";
import StartupDashboard, {
  StartupData,
} from "@/components/admin-components/StartUpDashborad";
import { redirect } from "next/navigation";
import React from "react";

async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }
  const startupData = await fetchStartupStats(
    "7f9e98ce-1ab4-450b-a0de-bc36b5d452e5" // TODO: set real startup
  );
  return (
    <div>
      <StartupDashboard
        startupName="Life Blood"
        startupData={startupData as unknown as StartupData}
      />
    </div>
  );
}

export default Home;
