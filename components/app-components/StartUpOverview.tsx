import { Startup } from "@/dummy";
import { Rocket, Star } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { StartUpCover } from "./index";

function StartUpOverview({
  category,
  contact,
  description,
  name,
  rating,
  reviews,
  logo,
  colors,
}: Startup) {
  return (
    <section className="start-up-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{name}</h1>

        <div className="start-up-info">
          <p>
            Category{" "}
            <span className="font-semibold text-light-200">{category}</span>
          </p>

          <div className="flex flex-row gap-1 items-center">
            <Star className="text-yellow-400" />
            <p className="text-light-200">{rating}</p>
          </div>
        </div>

        <p className="start-up-description">{description}</p>

        <Button className="start-up-overview_btn items-center">
          <Rocket size={30} />
          <p className="font-bebas-neue text-xl text-dark-100">Read More</p>
        </Button>
      </div>

      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <StartUpCover
            variant="medium"
            className="z-10"
            primaryColor={colors.primaryColor}
            accentColor={colors.secondaryColor}
            coverImage={logo}
          />

          <div className="absolute left-16 top-10 rotate-13 opacity-40 max-sm:hidden">
            <StartUpCover
              variant="medium"
              primaryColor={colors.primaryColor}
              accentColor={colors.secondaryColor}
              coverImage={logo}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default StartUpOverview;
