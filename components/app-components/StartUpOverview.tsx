"use client";

import { Rocket, Star } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { StartUpCover } from "./index";
import { Startup } from "@/types/general";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import MarkdownRenderer from "./general-components/MarkDownRenderer";

function StartUpOverview(startUp: Startup) {
  const { name, description, logo, rating, companyColors, categoryName, id } =
    startUp;
  const [expanded] = useState(false);

  const color = companyColors?.split(",")[0];
  const pathName = usePathname();
  const isDetailPage = pathName.includes("startup");

  const shortDescription = description
    ? description.length > 150
      ? description.substring(0, 150) + "..."
      : description
    : "";

  return (
    <section className="start-up-overview backdrop-blur-sm bg-white/5 p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl border border-white/10 w-full">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start lg:items-center">
        <div className="flex flex-1 flex-col gap-3 sm:gap-5 w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {name}
          </h1>

          <div className="start-up-info flex flex-row flex-wrap gap-2 sm:gap-4 items-center">
            <div className="px-2 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
              <p className="text-xs sm:text-sm">
                <span className="opacity-70">Category: </span>
                <span className="font-semibold text-light-200">
                  {categoryName}
                </span>
              </p>
            </div>

            <div className="flex flex-row gap-1 items-center px-2 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
              <Star className="text-yellow-400 h-3 w-3 sm:h-4 sm:w-4" />
              <p className="text-light-200 text-xs sm:text-sm">{rating}</p>
            </div>
          </div>

          {!isDetailPage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mt-2"
            >
              <p className="start-up-description text-gray-300 text-sm sm:text-base leading-relaxed">
                {expanded ? (
                  <MarkdownRenderer markdownContent={description} />
                ) : (
                  <MarkdownRenderer markdownContent={shortDescription} />
                )}
              </p>

              <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 sm:mt-6">
                <Button className="start-up-overview_btn items-center bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 border-none shadow-lg h-8 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm">
                  <Link
                    href={`/startup/${id}`}
                    className="flex items-center gap-1 sm:gap-2"
                  >
                    <Rocket size={16} className="sm:w-5 sm:h-5" />
                    <p className="font-medium">View Details</p>
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          className="relative flex-shrink-0 w-full sm:w-2/3 md:w-1/2 lg:w-2/5 mx-auto lg:mx-0 mt-4 lg:mt-0"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative w-full max-w-xs mx-auto">
            <StartUpCover
              className="z-10 shadow-2xl w-full"
              accentColor={color as string}
              coverImage={logo as string}
            />

            <div
              className="absolute -right-6 -bottom-4 rotate-6 opacity-30 hidden sm:block filter blur-sm transition-all duration-700 hover:blur-none hover:opacity-40"
              style={{
                transform: "rotateY(20deg) rotateX(5deg) rotateZ(6deg)",
                transformStyle: "preserve-3d",
                width: "90%",
                height: "90%",
              }}
            >
              <StartUpCover
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
