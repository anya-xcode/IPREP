const full = require("@prisma/client");
console.log("Full keys:", Object.keys(full));
console.log("Full.PrismaClient:", full.PrismaClient ? "exists" : "missing");
if (full.PrismaClient) {
    try {
        const p = new full.PrismaClient();
        console.log("Success with full.PrismaClient");
    } catch (e) {
        console.log("Fail with full.PrismaClient:", e.message);
    }
}
