const { PrismaClient } = require("./generated/prisma/client.ts");
try {
    const prisma = new PrismaClient();
    console.log("Successfully instantiated generated PrismaClient");
} catch (error) {
    console.error("Failed to instantiate generated PrismaClient:");
    console.error(error.message);
}
