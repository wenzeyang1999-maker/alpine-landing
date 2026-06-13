import { defineConfig } from "drizzle-kit";

// Drizzle config for the Azure Postgres migration.
// `drizzle-kit pull` introspects the live DB and generates the schema under lib/db/.
export default defineConfig({
  dialect: "postgresql",
  out: "./lib/db",
  schemaFilter: ["public", "manager"],
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
