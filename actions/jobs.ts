"use server";
import { auth } from "@/auth";
import db from "@/database/drizzle";
import { jobs, startups, users } from "@/database/schema";
import { jobFormSchema } from "@/lib/validations";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const addJob = async (formData: z.infer<typeof jobFormSchema>) => {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        error: "You must be logged in to add a new job",
      };
    }

    const userStartUp = await db
      .select()
      .from(startups)
      .where(eq(startups.ownerId, session.user.id))
      .limit(1);

    if (userStartUp.length === 0) {
      return {
        success: false,
        error: "You must be logged in to add a new job",
      };
    }

    if (session?.user?.role !== "startup_owner") {
      return {
        success: false,
        error: "You are not logged in to add a new job",
      };
    }

    const {
      contactEmail,
      description,
      location,
      title,
      expiresAt,
      jobType,
      requirements,
      salary,
    } = formData;

    if (!expiresAt) {
      return {
        success: false,
        error: "Please select an expiration date",
      };
    }

    await db.insert(jobs).values({
      contactEmail,
      description,
      location,
      title,
      expiresAt,
      jobType,
      requirements,
      salary,
      startupId: userStartUp[0].id,
    });

    return { success: true };
  } catch (error) {
    console.log("[SERVER_ERROR_ADD_JOBS]: ", error);
  }
};
export const getJobs = async (startupId: string) => {
  try {
    const listedJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.startupId, startupId));

    const locations = await db
      .selectDistinct({
        location: jobs.location,
      })
      .from(jobs);

    const jobTypes = await db
      .selectDistinct({
        jobType: jobs.jobType,
      })
      .from(jobs);

    // Convert { location: string }[] to string[]
    const locationValues = locations
      .map((loc) => loc.location)
      .filter((loc): loc is string => loc !== null);

    // Convert { jobType: string }[] to string[]
    const jobTypeValues = jobTypes
      .map((type) => type.jobType)
      .filter((type): type is string => type !== null);

    return { listedJobs, jobTypes: jobTypeValues, locations: locationValues };
  } catch (error) {
    console.error("[SERVER_ERROR_GET_JOBS]: ", error);
    return {
      listedJobs: [],
      jobTypes: [],
      locations: [],
    };
  }
};
