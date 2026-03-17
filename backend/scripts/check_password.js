const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const settings = await prisma.adminSettings.findFirst();
    console.log('Admin Settings:', JSON.stringify(settings, null, 2));
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
