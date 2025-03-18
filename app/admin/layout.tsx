import { auth } from "@/auth";
import Header from "@/components/admin-components/Header";
import Sidebar from "@/components/admin-components/Sidebar";
import { redirect } from "next/navigation";
import React from "react";

async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.id) redirect("/sign-in");

  return (
    <main className="flex min-h-screen w-full">
      <div className="w-64">
        <Sidebar session={session} />
      </div>

      <section className="flex flex-col flex-1">
        <div className="p-5 bg-white border-b border-gray-200 shadow-sm">
          <Header session={session} />
        </div>
        <div className="p-5 flex-1">{children}</div>
      </section>
    </main>
  );
}

export default Layout;
