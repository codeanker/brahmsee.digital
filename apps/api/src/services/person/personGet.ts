import { Prisma, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { getPersonProtectionFilter } from './personList.js'

export const personGetProcedure = defineProtectedQueryProcedure({
  key: 'get',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN, Role.USER],
  inputSchema: z.strictObject({
    id: z.number().int(),
  }),
  handler: async ({ ctx, input }) => {
    const protection = await getPersonProtectionFilter(ctx)
    const where: Prisma.PersonWhereUniqueInput = {
      ...protection,
      id: input.id,
    }

    return await prisma.person.findUniqueOrThrow({
      where,
      select: {
        id: true,
        firstname: true,
        lastname: true,
        birthday: true,
        gender: true,
        email: true,
        telefon: true,
        address: {
          select: {
            zip: true,
            city: true,
            street: true,
            streetNumber: true,
            country: true,
            valid: true,
            lat: true,
            lon: true,
          },
        },
        nahrungsmittelIntoleranzen: true,
        weitereIntoleranzen: true,
        essgewohnheit: true,
        notfallkontakte: {
          select: {
            firstname: true,
            lastname: true,
            telefon: true,
            istErziehungsberechtigt: true,
          },
        },
        gliederung: true,
        photoId: true,
      },
    })
  },
})
