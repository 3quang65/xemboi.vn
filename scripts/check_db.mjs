import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
try {
  await prisma.$connect();
  console.log('PostgreSQL Connected successfully!');
} catch (e) {
  console.log('PostgreSQL Connection error:', e.message);
} finally {
  await prisma.$disconnect();
  process.exit(0);
}
