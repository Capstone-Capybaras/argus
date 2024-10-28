CREATE TABLE IF NOT EXISTS "revoked_tokens" (
	"tokenHash" char(64) PRIMARY KEY NOT NULL,
	"revokedAt" timestamp DEFAULT now(),
	CONSTRAINT "revoked_tokens_tokenHash_unique" UNIQUE("tokenHash")
);
