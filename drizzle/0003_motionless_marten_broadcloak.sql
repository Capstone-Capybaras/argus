ALTER TABLE "revoked_tokens" RENAME COLUMN "tokenHash" TO "token_hash";--> statement-breakpoint
ALTER TABLE "revoked_tokens" RENAME COLUMN "revokedAt" TO "revoked_at";--> statement-breakpoint
ALTER TABLE "revoked_tokens" DROP CONSTRAINT "revoked_tokens_tokenHash_unique";--> statement-breakpoint
ALTER TABLE "revoked_tokens" ADD CONSTRAINT "revoked_tokens_token_hash_unique" UNIQUE("token_hash");