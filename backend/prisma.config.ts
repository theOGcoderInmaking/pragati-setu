import "dotenv/config";
import { defineConfig } from "prisma/config";
import path from "path";

// Load .env from frontend folder
require('dotenv').config({ path: path.resolve(__dirname, '../frontend/.env') });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: 'npx ts-node prisma/seed-dashboard.ts',
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
