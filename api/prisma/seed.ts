import { PrismaClient } from '@prisma/client'

import { importGliederungen } from './gliederungen'

const prisma = new PrismaClient()
async function main() {
  await importGliederungen(prisma)
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
