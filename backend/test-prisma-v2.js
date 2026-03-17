const { PrismaClient } = require('./node_modules/.prisma/client/index.js');
try {
  const prisma = new PrismaClient();
  console.log('PrismaClient from index.js created successfully');
  process.exit(0);
} catch (e) {
  console.error('Failed to create PrismaClient from index.js:', e);
  process.exit(1);
}
