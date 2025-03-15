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
      <h2 className="font-bebas-neue text-4xl text-light-100 mt-4">{title}</h2>
      <ul className="start-up-list">
        {startups.map((startup) => (
          <StartUpCard key={startup.name} {...startup} />
        ))}
      </ul>
    </section>
  );
}

export default StartUpList;
