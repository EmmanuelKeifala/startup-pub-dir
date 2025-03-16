import Link from "next/link";
import React from "react";
import { StartUpCover } from "./index";
import { Startup } from "@/types/general";

function StartUpCard({ id, categoryName, companyColors, logo, name }: Startup) {
  const color = companyColors?.split(",")[0];

  return (
    <li className="xs:w-52 w-full">
      <Link
        href={`/startup/${id}`}
        className="w-full flex flex-col items-center"
      >
        <StartUpCover
          accentColor={color as string}
          coverImage={logo as string}
          variant="regular"
        />

        <div className="mt-4 xs:mx-w-40">
          <p className="start-up_name ">{name}</p>
          <p className="start-up_category">{categoryName}</p>
        </div>
      </Link>
    </li>
  );
}

export default StartUpCard;
