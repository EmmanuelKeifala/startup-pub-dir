"use server";

import { ServiceFormValues } from "@/components/app-components/ServiceForm";
import { Service } from "@/components/app-components/StartupServices";
import db from "@/database/drizzle";
import {
  reviews,
  startupCategories,
  startups,
  users,
  startupViews,
  startupServices,
} from "@/database/schema";
import { and, eq } from "drizzle-orm";

export const getStartUp = async ({ params }: { params: { id: string } }) => {
  try {
    // Track the view
    await db.insert(startupViews).values({
      startupId: params.id,
      userId: null, // Assuming anonymous views, set to null
    });

    const [startUpDetails] = await db
      .select({
        id: startups.id,
        name: startups.name,
        description: startups.description,
        location: startups.location,
        website: startups.website,
        email: startups.email,
        phone: startups.phone,
        social: startups.social,
        logo: startups.logo,
        video: startups.video,
        companyColors: startups.companyColors,
        status: startups.status,
        rating: startups.rating,
        categoryId: startups.categoryId,
        categoryName: startupCategories.name,
      })
      .from(startups)
      .innerJoin(
        startupCategories,
        eq(startups.categoryId, startupCategories.id)
      )
      .where(and(eq(startups.status, "approved"), eq(startups.id, params.id)));

    return startUpDetails || null;
  } catch (error) {
    console.log("[SERVER_ERROR_FETCHING_USER_STARTUPS]: ", error);
    return null;
  }
};
export const getStartUpReviews = async ({
  params,
}: {
  params: { id: string };
}) => {
  try {
    const initialReviews = await db
      .select({
        reviewId: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        userId: users.id,
        name: users.fullname,
        image: users.profilePicture,
        id: reviews.id,
        startupId: reviews.startupId,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.startupId, params.id));

    return initialReviews;
  } catch (error) {
    console.log("[SERVER_ERROR_FETECHING_INITIAL_REVIEWS]: ", error);
    return [];
  }
};

export const getAllStartUps = async () => {
  try {
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
        categoryName: startupCategories.name,
      })
      .from(startups)
      .innerJoin(
        startupCategories,
        eq(startups.categoryId, startupCategories.id)
      )
      .where(eq(startups.status, "approved"));

    return startupsFromDB;
  } catch (error) {
    console.log("[SERVER_ERROR_FETCHING_ALL_STARTUPS]: ", error);
    return [];
  }
};

export const getUserStartUp = async ({
  params,
}: {
  params: { id: string };
}) => {
  try {
    const [startUpDetails] = await db
      .select({
        id: startups.id,
        name: startups.name,
        description: startups.description,
        location: startups.location,
        website: startups.website,
        email: startups.email,
        phone: startups.phone,
        social: startups.social,
        logo: startups.logo,
        video: startups.video,
        companyColors: startups.companyColors,
        status: startups.status,
        rating: startups.rating,
        categoryId: startups.categoryId,
        categoryName: startupCategories.name,
      })
      .from(startups)
      .innerJoin(
        startupCategories,
        eq(startups.categoryId, startupCategories.id)
      )
      .where(eq(startups.ownerId, params.id));

    return startUpDetails || null;
  } catch (error) {
    console.log("[SERVER_ERROR_FETCHING_USER_STARTUPS]: ", error);
    return null;
  }
};

export const getAllPendingStartups = async () => {
  try {
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
        categoryName: startupCategories.name,
      })
      .from(startups)
      .innerJoin(
        startupCategories,
        eq(startups.categoryId, startupCategories.id)
      )
      .where(eq(startups.status, "pending"));

    return startupsFromDB;
  } catch (error) {
    console.log("[SERVER_ERROR_FETCHING_ALL_STARTUPS]: ", error);
    return [];
  }
};

export const hasApprovedStartup = async ({
  params,
}: {
  params: { id: string };
}) => {
  try {
    const startup = await db
      .select({
        id: startups.id,
      })
      .from(startups)
      .where(
        and(eq(startups.ownerId, params.id), eq(startups.status, "approved"))
      )
      .limit(1);

    if (startup.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("[SERVER_ERROR_CHECKING_USER_STARTUP]: ", error);
  }
};

export const addStartUpService = async ({
  description,
  name,
  startupId,
}: ServiceFormValues): Promise<{
  success: boolean;
  error?: any;
  data?: any;
}> => {
  try {
    if (!startupId) {
      return { success: false, error: "No startup id provided" };
    }

    const startUpExist = await db
      .select()
      .from(startups)
      .where(eq(startups.id, startupId))
      .limit(1);
    if (startUpExist.length < 1) {
      return { success: false, error: "No startup found" };
    }
    const service = await db.insert(startupServices).values({
      startupId,
      name,
      description,
    });

    return { success: true };
  } catch (error) {
    console.log("[ERROR_ADDING_SERVICE]");
    return { success: false, error };
  }
};

export const getStartUpServices = async ({
  startupId,
}: {
  startupId: string;
}): Promise<{ success: boolean; data: Service[]; error?: string }> => {
  try {
    const startupExist = await db
      .select()
      .from(startups)
      .where(eq(startups.id, startupId))
      .limit(1);

    if (startupExist.length < 1) {
      return { success: false, error: "No startup found", data: [] };
    }

    const services = await db
      .select()
      .from(startupServices)
      .where(eq(startupServices.startupId, startupId));

    // Map the query results to Service objects
    const formattedServices: Service[] = services.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    }));

    return {
      success: true,
      data: formattedServices,
    };
  } catch (error) {
    console.log("[ERROR_GETTING_STARTUP_SERVICES]: ", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: [],
    };
  }
};
