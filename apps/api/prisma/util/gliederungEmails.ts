import { PrismaClient } from '@prisma/client'
import { enrichEmailAdresses } from '../seeders/gliederungen.js'

const prisma = new PrismaClient()
const enrichEmailAdressesTyped = enrichEmailAdresses as (prisma: PrismaClient) => Promise<void>

await prisma.$connect()

await enrichEmailAdressesTyped(prisma)

await prisma.$disconnect()
