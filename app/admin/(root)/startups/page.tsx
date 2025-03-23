import React from "react";
import StartupTable from "../approvals/_components/StartupTable";
import { getAllStartUps } from "@/actions/helper-actions";
import { Startup } from "@/types/general";

async function page() {
  const data = await getAllStartUps();
  return <StartupTable type="approved" data={data as Startup[]} />;
}

export default page;
