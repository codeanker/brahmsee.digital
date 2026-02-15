import { PrismaClient } from '@prisma/client'
import { enrichEmailAdresses } from '../seeders/gliederungen.js'

const prisma = new PrismaClient()

await prisma.$connect()

await enrichEmailAdresses(prisma)

await prisma.$disconnect()
