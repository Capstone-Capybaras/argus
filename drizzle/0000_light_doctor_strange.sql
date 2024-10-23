CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"test_column" text,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
