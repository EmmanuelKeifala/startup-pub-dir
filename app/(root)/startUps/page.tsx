import { getAllStartUps } from "@/actions/helper-actions";
import SearchStartups from "@/components/app-components/SearchStartups";
import { Startup } from "@/types/general";
import React from "react";

async function StartUps() {
  const startupsFromDB = await getAllStartUps();
  return <SearchStartups defaultValues={startupsFromDB as Startup[]} />;
}

export default StartUps;
