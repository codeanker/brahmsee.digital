import { z } from 'zod'

import prisma from '../../prisma'
import { publicProcedure, router } from '../../trpc'

export const gliederungRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        edv: z.number(),
      })
    )
    .mutation(async (opts) => {
      const gliederungen = await prisma.gliederung.create({
        data: {
          name: opts.input.name,
          edv: opts.input.edv,
        },
        select: {
          id: true,
        },
      })
      return gliederungen
    }),
  /** Die Liste der gliederung */
  list: publicProcedure.query(async () => {
    const gliederungen = await prisma.gliederung.findMany({
      select: {
        id: true,
        name: true,
        edv: true,
      },
    })
    return gliederungen
  }),
})
