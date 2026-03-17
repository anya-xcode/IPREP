const { PrismaClient } = require("./node_modules/@prisma/client");
try {
    const prisma = new PrismaClient();
    console.log("Successfully instantiated PrismaClient");
} catch (error) {
    console.error("Failed to instantiate PrismaClient:");
    console.error(error.message);
}
