const { PrismaClient } = require("@prisma/client/edge");
try {
    const prisma = new PrismaClient();
    console.log("Successfully instantiated edge PrismaClient");
} catch (error) {
    console.error("Failed edge:", error.message);
}
