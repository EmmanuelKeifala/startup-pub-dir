import React from "react";
import StartupTable from "../approvals/_components/StartupTable";
import { getAllStartUps } from "@/actions/helper-actions";

async function page() {
  const data = await getAllStartUps();
  return <StartupTable type="approved" data={data} />;
}

export default page;
