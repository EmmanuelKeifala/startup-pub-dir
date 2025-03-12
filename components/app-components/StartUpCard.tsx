import { Startup } from "@/dummy";
import Link from "next/link";
import React from "react";
import { StartUpCover } from "./index";
import { cn } from "@/lib/utils";

function StartUpCard({
  id,
  category,
  colors,
  contact,
  description,
  location,
  logo,
  name,
  rating,
  reviews,
  video,
  website,
}: Startup) {
  return (
    <li className="xs:w-52 w-full">
      <Link
        href={`/startup/${id}`}
        className="w-full flex flex-col items-center"
      >
        <StartUpCover
          accentColor={colors.primaryColor}
          coverImage={logo}
          variant="regular"
        />

        <div className="mt-4 xs:mx-w-40">
          <p className="start-up_name ">{name}</p>
          <p className="start-up_category">{category}</p>
        </div>
      </Link>
    </li>
  );
}

export default StartUpCard;
