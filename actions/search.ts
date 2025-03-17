"use server";

import db from "@/database/drizzle";
import { startupCategories, startups } from "@/database/schema";
import { sql, eq, and, gte, ilike } from "drizzle-orm";

export async function searchStartupsAction(
  query: string,
  filters: { categoryId?: string; location?: string; minRating?: number }
) {
  let searchConditions = [];

  if (query) {
    searchConditions.push(
      sql`to_tsvector('english', ${startups.name} || ' ' || ${startups.description} || ' ' || ${startups.location}) @@ plainto_tsquery(${query})`
    );
  }

  if (filters.categoryId) {
    searchConditions.push(eq(startups.categoryId, filters.categoryId));
  }
  if (filters.location) {
    // Use `ilike` for case-insensitive location filtering
    searchConditions.push(ilike(startups.location, `%${filters.location}%`));
  }
  if (filters.minRating) {
    searchConditions.push(gte(startups.rating, filters.minRating));
  }

  const whereClause =
    searchConditions.length > 0 ? and(...searchConditions) : undefined;

  // Execute the query
  const results = await db
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
      categoryName: startupCategories.name,
    })
    .from(startups)
    .innerJoin(startupCategories, eq(startups.categoryId, startupCategories.id))
    .where(whereClause);

  return results;
}
