CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"startup_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"requirements" text,
	"salary" varchar(100),
	"job_type" varchar(50),
	"location" varchar(255) NOT NULL,
	"contact_email" text NOT NULL,
	"posted_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	CONSTRAINT "jobs_id_unique" UNIQUE("id")
);
