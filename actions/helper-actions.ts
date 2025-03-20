"use server";

import db from "@/database/drizzle";
import { reviews, startupCategories, startups, users } from "@/database/schema";
import { and, eq } from "drizzle-orm";

export const getStartUp = async ({ params }: { params: { id: string } }) => {
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
