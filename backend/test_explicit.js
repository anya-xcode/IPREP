const { PrismaClient } = require("@prisma/client");
try {
    const prisma = new PrismaClient({ datasources: { db: { url: "mongodb+srv://anaynagupta:Ananya123@cluster0.aphkfpa.mongodb.net/interviewDB?retryWrites=true&w=majority" } } });
    console.log("Success with explicit URL");
} catch (e) {
    console.error("Failure:", e.message);
}
