import { Startup } from "@/dummy";
import React from "react";

function StartUpList({
  startup,
  title,
  containerClassName,
}: {
  startup: Startup[];
  title: string;
  containerClassName: string;
}) {
  return (
    <section className="--font-geist">
      <h2 className="font-bebas-neue text-4xl text-light-100 ">
        Popular StartUps
      </h2>
    </section>
  );
}

export default StartUpList;
