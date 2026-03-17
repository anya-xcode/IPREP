const { PrismaClient } = require("@prisma/client");
try {
    const prisma = new PrismaClient();
    console.log("Success: PrismaClient instantiated");
} catch (e) {
    console.error("Failure:", e);
}
