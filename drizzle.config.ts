import { defineConfig } from "drizzle-kit";

// Get database URL - check multiple possible environment variable names
const getDatabaseUrl = () => {
  return process.env.DATABASE_URL 
    || process.env.NEXT_DATABASE_URL
    || process.env.POSTGRES_URL
    || process.env.NEXT_POSTGRES_URL
    || process.env.NEXT_POSTGRES_PRISMA_URL
    || "";
};

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: getDatabaseUrl(),
  },
  verbose: true,
  strict: true,
});
