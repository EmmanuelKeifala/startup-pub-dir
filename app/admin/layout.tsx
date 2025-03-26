// layout.tsx
import { auth } from "@/auth";
import Header from "@/components/admin-components/Header";
import Sidebar from "@/components/admin-components/Sidebar";
import { redirect } from "next/navigation";
import React from "react";

async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.id) redirect("/sign-in");
  if (session?.user?.role === "user") redirect("/");

  return (
    <div className="relative flex min-h-screen w-full bg-gray-50">
      <Sidebar session={session} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        <header className="sticky top-0 z-10 p-4 bg-white border-b border-gray-200 shadow-sm flex items-center lg:justify-between">
          <div className="lg:hidden">
            <div className="w-10"></div>
          </div>
          <Header session={session} />
        </header>
        <main className="p-4 md:p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
