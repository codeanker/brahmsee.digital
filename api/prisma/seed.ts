import { PrismaClient } from '@prisma/client'

import { importGleiderungen } from './gliederungen'

const prisma = new PrismaClient()
async function main() {
  await importGleiderungen(prisma)
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
