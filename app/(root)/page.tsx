import {
  StartUpOverview,
  StartUpList,
} from "@/components/app-components/index";
import db from "@/database/drizzle";
import { startupCategories, startups } from "@/database/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
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

  return (
    <div>
      <StartUpOverview {...startupsFromDB[0]} />

      <StartUpList
        title="New StartUps"
        startups={startupsFromDB}
        containerClassName="mt-28"
      />
    </div>
  );
}
