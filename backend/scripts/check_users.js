const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function checkUsers() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true
        }
    })
    console.log(JSON.stringify(users, null, 2))
    await prisma.$disconnect()
}

checkUsers().catch(e => {
    console.error(e)
    process.exit(1)
})
