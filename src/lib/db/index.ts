import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Get database URL - check multiple possible environment variable names
// Vercel/Neon integration may use NEXT_ prefix or POSTGRES_URL
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL 
    || process.env.NEXT_DATABASE_URL
    || process.env.POSTGRES_URL
    || process.env.NEXT_POSTGRES_URL
    || process.env.NEXT_POSTGRES_PRISMA_URL;
  
  if (!url) {
    throw new Error("Database URL not found. Please set DATABASE_URL environment variable.");
  }
  
  return url;
};

// Create the connection
const sql = neon(getDatabaseUrl());

// Create the drizzle instance
export const db = drizzle(sql, { schema });

export * from "./schema";
