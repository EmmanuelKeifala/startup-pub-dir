"use client";

import { Rocket, Star, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { StartUpCover } from "./index";
import { Startup } from "@/types/general";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

function StartUpOverview(startUp: Startup) {
  const { name, description, logo, rating, companyColors, categoryName, id } =
    startUp;
  const [expanded, setExpanded] = useState(false);

  const color = companyColors?.split(",")[0];
  const pathName = usePathname();
  const isDetailPage = pathName.includes("startup");

  const shortDescription = description
    ? description.length > 150
      ? description.substring(0, 150) + "..."
      : description
    : "";

  return (
    <section className="start-up-overview backdrop-blur-sm bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="flex flex-1 flex-col gap-5 md:pr-6">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {name}
          </h1>

          <div className="start-up-info flex flex-row flex-wrap gap-4 items-center">
            <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
              <p className="text-sm">
                <span className="opacity-70">Category: </span>
                <span className="font-semibold text-light-200">
                  {categoryName}
                </span>
              </p>
            </div>

            <div className="flex flex-row gap-1 items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
              <Star className="text-yellow-400 h-4 w-4" />
              <p className="text-light-200 text-sm">{rating}</p>
            </div>
          </div>

          {!isDetailPage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-2"
            >
              <p className="start-up-description text-gray-300 leading-relaxed">
                {expanded ? description : shortDescription}
              </p>

              <div className="flex gap-4 mt-6">
                {description && description.length > 150 && (
                  <Button
                    onClick={() => setExpanded(!expanded)}
                    variant="ghost"
                    className="flex items-center gap-1 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    {expanded ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        <span>Read Less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        <span>Read More</span>
                      </>
                    )}
                  </Button>
                )}

                <Button className="start-up-overview_btn items-center bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border-none shadow-lg">
                  <Link
                    href={`/startup/${id}`}
                    className="flex items-center gap-2"
                  >
                    <Rocket size={18} />
                    <p className="font-medium">View Details</p>
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          className="relative flex-shrink-0 w-full md:w-1/3 lg:w-2/5 flex justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative w-full max-w-xs mx-auto">
            <StartUpCover
              variant="medium"
              className="z-10 shadow-2xl w-full"
              accentColor={color as string}
              coverImage={logo as string}
            />

            <div
              className="absolute -right-6 -bottom-4 rotate-6 opacity-30 max-sm:hidden filter blur-sm transition-all duration-700 hover:blur-none hover:opacity-40"
              style={{
                transform: "rotateY(20deg) rotateX(5deg) rotateZ(6deg)",
                transformStyle: "preserve-3d",
                width: "90%",
                height: "90%",
              }}
            >
              <StartUpCover
                variant="medium"
                accentColor={color as string}
                coverImage={logo as string}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default StartUpOverview;
