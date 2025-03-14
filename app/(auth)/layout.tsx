"use client";
import React, { ReactNode } from "react";
import { RocketIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { useSession } from "next-auth/react";

// Dynamically import Lottie to prevent SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import authAnimation from "@/public/animations/auth-animation.json";

function Layout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  if (session?.user) {
    redirect("/");
  }
  return (
    <main className="auth-container">
      {/* Authentication Form Section */}
      <section className="auth-form">
        <div className="auth-box">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
            <RocketIcon size={50} className="text-blue-500" />
            <div>
              <h1 className="text-3xl md:text-5xl font-bold">Startup Pub</h1>
              <p className="text-gray-300 text-sm md:text-base">
                Discover and support startups in your area.
              </p>
            </div>
          </div>

          <div className="">{children}</div>
        </div>
      </section>

      {/* Animation Section */}
      <section className="auth-illustration flex justify-center items-center">
        <div className="w-3/4 md:w-full max-w-lg">
          <Lottie animationData={authAnimation} loop={true} />
        </div>
      </section>
    </main>
  );
}

export default Layout;
