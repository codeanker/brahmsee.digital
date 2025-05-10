import { z } from 'zod'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import prisma from '../../prisma.js'

export const programSearchLocationProcedure = defineProtectedQueryProcedure({
  key: 'searchLocation',
  roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'],
  inputSchema: z.string(),
  handler: async ({ input }) => {
    const results = await prisma.programmPunkt.findMany({
      where: {
        location: {
          contains: input,
          mode: 'insensitive',
        },
      },
      distinct: ['location'],
      select: {
        location: true,
      },
    })

    return results.map((row) => row.location)
  },
})

export const programSearchResponsiblesProcedure = defineProtectedQueryProcedure({
  key: 'searchResponsibles',
  roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'],
  inputSchema: z.string(),
  handler: async ({ input }) => {
    const results = await prisma.programmPunkt.findMany({
      where: {
        responsible: {
          contains: input,
          mode: 'insensitive',
        },
      },
      distinct: ['responsible'],
      select: {
        responsible: true,
      },
    })

    return results.map((row) => row.responsible)
  },
})
