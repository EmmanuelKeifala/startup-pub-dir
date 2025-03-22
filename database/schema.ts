import {
  integer,
  uuid,
  pgTable,
  varchar,
  timestamp,
  text,
  pgEnum,
  real,
} from "drizzle-orm/pg-core";

export const STARTUP_STATUS_ENUM = pgEnum("startup_status", [
  "pending",
  "approved",
  "rejected",
]);

export const USER_TYPE = pgEnum("user_type", [
  "admin",
  "startup_owner",
  "user",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().notNull().defaultRandom().unique(),
  fullname: varchar("fullname", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: USER_TYPE("role").notNull().default("user"),
  profilePicture: text("profile_picture"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const startups = pgTable("startups", {
  id: uuid("id").primaryKey().notNull().defaultRandom().unique(),
  ownerId: uuid("owner_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  categoryId: uuid("category_id").references(() => startupCategories.id, {
    onDelete: "set null",
  }), // Links to categories
  description: text("description").notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  website: text("website"),
  phone: varchar("phone", { length: 20 }),
  email: text("email"),
  social: text("social"),
  rating: real("rating").default(0),
  logo: text("logo"),
  video: text("video"),
  companyColors: varchar("company_colors", { length: 50 }),
  status: STARTUP_STATUS_ENUM("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().notNull().defaultRandom().unique(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  startupId: uuid("startup_id")
    .references(() => startups.id, { onDelete: "cascade" })
    .notNull(),
  rating: integer("rating").notNull(), // 1-5 star rating
  comment: text("comment").notNull(),
  sentiment: text("sentiment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviewReplies = pgTable("review_replies", {
  id: uuid("id").primaryKey().notNull().defaultRandom().unique(),
  reviewId: uuid("review_id")
    .references(() => reviews.id, { onDelete: "cascade" })
    .notNull(),
  ownerId: uuid("owner_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  replyText: text("reply_text").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const savedStartups = pgTable("saved_startups", {
  id: uuid("id").primaryKey().notNull().defaultRandom().unique(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  startupId: uuid("startup_id")
    .references(() => startups.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const startupCategories = pgTable("startup_categories", {
  id: uuid("id").primaryKey().notNull().defaultRandom().unique(),
  name: varchar("name", { length: 100 }).notNull().unique(),
});

export const startupViews = pgTable("startup_views", {
  id: uuid("id").primaryKey().notNull().defaultRandom().unique(),
  startupId: uuid("startup_id")
    .references(() => startups.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  viewedAt: timestamp("viewed_at").notNull().defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().notNull().defaultRandom().unique(),
  startupId: uuid("startup_id")
    .references(() => startups.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  requirements: text("requirements"),
  salary: varchar("salary", { length: 100 }), // Example: "$5000 - $7000/month"
  jobType: varchar("job_type", { length: 50 }), // Example: "Full-time", "Part-time", "Remote"
  location: varchar("location", { length: 255 }).notNull(),
  contactEmail: text("contact_email").notNull(),
  postedAt: timestamp("posted_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
});
