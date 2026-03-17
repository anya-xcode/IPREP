const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function promoteUser(email) {
    const user = await prisma.user.update({
        where: { email },
        data: { role: "ADMIN" }
    })
    console.log(`Promoted user: ${user.email} to ${user.role}`)
    await prisma.$disconnect()
}

promoteUser("anan@gmail.com").catch(e => {
    console.error(e)
    process.exit(1)
})
