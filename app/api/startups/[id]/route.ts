import db from "@/database/drizzle";
import { startups } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const startup = await db
      .select()
      .from(startups)
      .where(eq(startups.id, id))
      .limit(1);

    if (!startup) {
      return new Response("Startup not found", { status: 404 });
    }

    return Response.json({
      startup: startup[0],
    });
  } catch (error) {
    console.log("[SERVER_ERROR_GET_STARTUPS: ", error);
    return new Response("SERVER_ERROR_GET_STARTUPS", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const startup = await db
      .update(startups)
      .set(body)
      .where(eq(startups.id, id))
      .returning();

    return Response.json({
      startup: startup[0],
    });
  } catch (error) {
    console.log("[SERVER_ERROR_PATCH_STARTUPS: ", error);
    return new Response("SERVER_ERROR_PATCH_STARTUPS", { status: 500 });
  }
}
