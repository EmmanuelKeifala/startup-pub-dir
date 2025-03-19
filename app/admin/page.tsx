import {
  fetchAdminDashboardData,
  fetchStartupStats,
} from "@/actions/startup-dashboard-data";
import { auth } from "@/auth";
import AdminDashboard from "@/components/admin-components/AdminDashboard";
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

  const adminData = await fetchAdminDashboardData();

  if (session?.user.role === "startup_owner") {
    return (
      <StartupDashboard
        startupName="Life Blood"
        startupData={startupData as unknown as StartupData}
      />
    );
  }
  if (session?.user.role === "admin") {
    return <AdminDashboard adminData={adminData} />;
  }
}

export default Home;
