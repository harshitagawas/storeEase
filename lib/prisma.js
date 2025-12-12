import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

let prisma;

if (!global.prisma) {
  const connectionString = process.env.DATABASE_URL;

  // Create Neon connection pool
  const pool = new Pool({ connectionString });

  // Create Prisma adapter
  const adapter = new PrismaNeon(pool);

  // Create Prisma Client with adapter
  prisma = new PrismaClient({ adapter });

  global.prisma = prisma;
} else {
  prisma = global.prisma;
}

export { prisma };
