const { PrismaClient } = require("@prisma/client");
console.log("Constructor:", PrismaClient.toString());
try {
    const prisma = new PrismaClient();
    console.log("Successfully instantiated PrismaClient");
} catch (error) {
    console.error("Failed:", error.message);
}
