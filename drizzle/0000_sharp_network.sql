CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_id" integer NOT NULL,
	"surname" text NOT NULL,
	"name" text NOT NULL,
	"patronymic" text,
	"phone_number" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"refresh_token" text,
	"refresh_token_expired_after" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "phone_number_format" CHECK ("users"."phone_number" ~ '^(\+7|8)\d{10}$'),
	CONSTRAINT "email_format" CHECK ("users"."email" ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);
