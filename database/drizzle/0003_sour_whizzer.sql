CREATE TABLE "startup_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"startup_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"price" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "startup_services_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "startups" ADD COLUMN "opening_hours" varchar(100);--> statement-breakpoint
ALTER TABLE "startup_services" ADD CONSTRAINT "startup_services_startup_id_startups_id_fk" FOREIGN KEY ("startup_id") REFERENCES "public"."startups"("id") ON DELETE cascade ON UPDATE no action;