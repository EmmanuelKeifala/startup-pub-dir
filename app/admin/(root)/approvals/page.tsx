import React from "react";
import StartupTable from "./_components/StartupTable";
import { getAllPendingStartups } from "@/actions/helper-actions";
import { Startup } from "@/types/general";

async function page() {
  const data = await getAllPendingStartups();
  return (
    <div>
      <StartupTable type="pending" data={data as Startup[]} />
    </div>
  );
}

export default page;
