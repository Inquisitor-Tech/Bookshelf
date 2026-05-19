// lib/prisma.ts
// Singleton Prisma client - prevents creating multiple connections in dev mode

import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  if (!process.env.TURSO_DATABASE_URL) {
    return new PrismaClient();
  }
  const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  const adapter = new PrismaLibSQL(libsql);
  return new PrismaClient({ adapter } as any);
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
