import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { createSqliteAdapter } from './sqliteAdapter'

export const prisma = new PrismaClient({
  adapter: createSqliteAdapter(),
})
