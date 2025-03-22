import { getUserStartUp } from "@/actions/helper-actions";
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

  if (session?.user.role === "startup_owner") {
    const userStartUp = await getUserStartUp({
      params: {
        id: session?.user.id,
      },
    });

    const startupData = await fetchStartupStats(userStartUp?.id as string);
    return (
      <StartupDashboard
        startupName={userStartUp?.name}
        startupData={startupData as unknown as StartupData}
      />
    );
  }
  if (session?.user.role === "admin") {
    const adminData = await fetchAdminDashboardData();
    return <AdminDashboard adminData={adminData} />;
  }
}

export default Home;
