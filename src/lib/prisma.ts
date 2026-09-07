import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Handle serverless / Vercel read-only filesystem for SQLite
if (process.env.VERCEL) {
  const tmpDbPath = path.join('/tmp', 'dev.db');
  if (!fs.existsSync(tmpDbPath)) {
    const sourceDb = path.join(process.cwd(), 'prisma', 'dev.db');
    if (fs.existsSync(sourceDb)) {
      try {
        fs.copyFileSync(sourceDb, tmpDbPath);
      } catch (e) {
        console.error('Failed to copy demo database to /tmp:', e);
      }
    }
  }
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('dev.db')) {
    process.env.DATABASE_URL = `file:${tmpDbPath}`;
  }
} else if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

