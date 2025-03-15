import db from "@/database/drizzle";
import { startupCategories } from "@/database/schema";

export async function GET() {
  try {
    const categories = await db.select().from(startupCategories);
    console.log(categories);
    return Response.json({
      categories,
    });
  } catch (error) {
    console.log("[GET_CATEGORIES_ERROR]: ", error);
  }
}
