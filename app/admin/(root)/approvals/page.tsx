import React from "react";
import StartupTable from "./_components/StartupTable";
import { getAllPendingStartups } from "@/actions/helper-actions";

async function page() {
  const data = await getAllPendingStartups();
  return (
    <div>
      <StartupTable data={data} />
    </div>
  );
}

export default page;
