"use client";
import { Rocket, Star } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { StartUpCover } from "./index";
import { Startup } from "@/types/general";
import Link from "next/link";
import { usePathname } from "next/navigation";

function StartUpOverview(startUp: Startup) {
  const { name, description, logo, rating, companyColors, categoryName, id } =
    startUp;

  const color = companyColors?.split(",")[0];

  const pathName = usePathname();
  console.log(pathName);
  return (
    <section className="start-up-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{name}</h1>

        <div className="start-up-info flex flex-col">
          <p>
            Category:{" "}
            <span className="font-semibold text-light-200">{categoryName}</span>
          </p>

          <div className="flex flex-row gap-1 items-center">
            <Star className="text-yellow-400" />
            <p className="text-light-200">{rating}</p>
          </div>
        </div>

        {!pathName.includes("startup") && (
          <>
            <p className="start-up-description">{description}</p>
            <Button className="start-up-overview_btn items-center">
              <Link href={`/startup/${id}`} className="flex items-center gap-2">
                <Rocket size={30} />
                <p className="font-bebas-neue text-xl text-dark-100">
                  Read More
                </p>
              </Link>
            </Button>
          </>
        )}
      </div>

      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <StartUpCover
            variant="medium"
            className="z-10"
            accentColor={color as string}
            coverImage={logo as string}
          />

          <div className="absolute left-16 top-10 rotate-13 opacity-40 max-sm:hidden">
            <StartUpCover
              variant="medium"
              accentColor={color as string}
              coverImage={logo as string}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default StartUpOverview;
