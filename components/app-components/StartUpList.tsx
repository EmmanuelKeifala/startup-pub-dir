import React from "react";
import { StartUpCard } from "./index";
import { Startup } from "@/types/general";

function StartUpList({
  startups,
  title,
  containerClassName,
}: {
  startups: Startup[];
  title: string;
  containerClassName: string;
}) {
  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-light-100 mt-4 mb-6">
        {title}
      </h2>
      <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10 px-2">
        {startups.map((startup) => (
          <StartUpCard key={startup.name} {...startup} />
        ))}
      </ul>
    </section>
  );
}

export default StartUpList;
