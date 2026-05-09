import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  dbInitialized: boolean
}

function getDatabaseUrl(): string {
  // In serverless (Netlify/Vercel), use /tmp for writable SQLite
  if (process.env.NETLIFY || process.env.VERCEL) {
    const tmpDb = '/tmp/sahaayak.db'
    return `file:${tmpDb}`
  }
  // Local development - use configured DATABASE_URL
  return process.env.DATABASE_URL || 'file:./db/sahaayak.db'
}

function ensureDatabase() {
  if (globalForPrisma.dbInitialized) return

  const isServerless = process.env.NETLIFY || process.env.VERCEL
  if (isServerless) {
    const tmpDb = '/tmp/sahaayak.db'
    if (!fs.existsSync(tmpDb)) {
      // Copy bundled db if exists, or create fresh
      const bundledDb = path.join(process.cwd(), 'prisma', 'db', 'sahaayak.db')
      if (fs.existsSync(bundledDb)) {
        fs.copyFileSync(bundledDb, tmpDb)
      } else {
        // Push schema to create tables in /tmp
        try {
          execSync(`DATABASE_URL="file:${tmpDb}" npx prisma db push --skip-generate --accept-data-loss 2>&1`, {
            cwd: process.cwd(),
            timeout: 15000,
          })
        } catch (e) {
          console.error('Failed to push schema:', e)
        }
      }
    }
  }
  globalForPrisma.dbInitialized = true
}

// Set the DATABASE_URL for Prisma
const dbUrl = getDatabaseUrl()
if (process.env.NETLIFY || process.env.VERCEL) {
  process.env.DATABASE_URL = dbUrl
}

ensureDatabase()

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    datasourceUrl: dbUrl,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db