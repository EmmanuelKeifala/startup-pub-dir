import Link from "next/link";
import React from "react";
import { StartUpCover } from "./index";
import { Startup } from "@/types/general";

function StartUpCard({ id, categoryName, companyColors, logo, name }: Startup) {
  const color = companyColors?.split(",")[0] || "#4CAF50";

  return (
    <li className="w-full flex flex-col">
      <Link href={`/startup/${id}`} className="w-full flex flex-col h-full">
        <div className="w-full">
          <StartUpCover accentColor={color} coverImage={logo as string} />
        </div>

        <div className="mt-3 w-full">
          <p className="start-up_name text-white text-base font-medium truncate">
            {name}
          </p>
          <p className="start-up_category text-gray-400 text-sm truncate">
            {categoryName}
          </p>
        </div>
      </Link>
    </li>
  );
}

export default StartUpCard;
