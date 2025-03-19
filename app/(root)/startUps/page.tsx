import SearchStartups from "@/components/app-components/SearchStartups";
import db from "@/database/drizzle";
import { startupCategories, startups } from "@/database/schema";
import { eq } from "drizzle-orm";
import React from "react";

async function StartUps() {
  const startupsFromDB = await db
    .select({
      id: startups.id,
      name: startups.name,
      description: startups.description,
      location: startups.location,
      website: startups.website,
      email: startups.email,
      phone: startups.phone,
      logo: startups.logo,
      video: startups.video,
      companyColors: startups.companyColors,
      status: startups.status,
      rating: startups.rating,
      categoryId: startups.categoryId,
      categoryName: startupCategories.name, // Include the category name
    })
    .from(startups)
    .innerJoin(
      startupCategories,
      eq(startups.categoryId, startupCategories.id)
    );
  return <SearchStartups defaultValues={startupsFromDB} />;
}

export default StartUps;
