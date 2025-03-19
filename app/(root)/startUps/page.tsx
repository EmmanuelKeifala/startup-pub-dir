import { getAllStartUps } from "@/actions/helper-actions";
import SearchStartups from "@/components/app-components/SearchStartups";
import React from "react";

async function StartUps() {
  const startupsFromDB = await getAllStartUps();
  return <SearchStartups defaultValues={startupsFromDB} />;
}

export default StartUps;
