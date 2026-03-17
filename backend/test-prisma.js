const { PrismaClient } = require('@prisma/client');
try {
  const prisma = new PrismaClient();
  console.log('PrismaClient created successfully');
  process.exit(0);
} catch (e) {
  console.error('Failed to create PrismaClient:', e);
  process.exit(1);
}
