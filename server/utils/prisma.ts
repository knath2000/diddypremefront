import { PrismaClient } from '@prisma/client'

// Ensure the PrismaClient is re-used across hot-reloads in development
// to prevent exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
} 