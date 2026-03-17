const { PrismaClient } = require('@prisma/client');
console.log('Type of PrismaClient:', typeof PrismaClient);
try {
  const p = new PrismaClient({ log: ['query'] });
  console.log('Success with options');
} catch (e) {
  console.log('Failed even with options:', e.message);
}
