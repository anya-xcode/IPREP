const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
    const q1 = await prisma.question.findMany({
        where: {
            status: "APPROVED",
            interviewRound: { not: { contains: 'HR Round', mode: 'insensitive' } }
        }
    });
    console.log("Excluded:", q1.length);
    const q2 = await prisma.question.findMany({
        where: {
            status: "APPROVED"
        }
    });
    console.log("Total APPROVED:", q2.length);
}
main().catch(console.error).finally(() => prisma.$disconnect());
