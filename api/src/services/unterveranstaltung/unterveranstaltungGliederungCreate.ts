import { Role } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'
import { unterveranstaltungCreateSchema, unterveranstaltungLandingSchema } from './schema/unterveranstaltung.schema.js'
import { crudFiles } from './schema/crudFiles.js'
import { crudMiscellaneousItems } from './schema/crudMiscellaneousItems.js'

export const unterveranstaltungGliederungCreateProcedure = defineProtectedMutateProcedure({
  key: 'gliederungCreate',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    data: unterveranstaltungCreateSchema,
    landingSettings: unterveranstaltungLandingSchema,
  }),
  async handler({ ctx, input }) {
    // check logged in user is admin of gliederung
    const gliederung = await getGliederungRequireAdmin(ctx.accountId)
    const veranstaltung = await prisma.veranstaltung.findUniqueOrThrow({
      where: {
        id: input.data.veranstaltungId,
      },
      select: {
        meldebeginn: true,
        meldeschluss: true,
      },
    })
    // check meldebegin is after parent meldebeginn
    if (new Date(input.data.meldebeginn) < veranstaltung.meldebeginn) {
      throw new TRPCError({
        message: 'Der Meldebeginn darf nicht vor dem Meldebeginn der übergeordneten Veranstaltung liegen',
        code: 'BAD_REQUEST',
      })
    }
    // check meldeschluss is before parent meldeschluss
    if (new Date(input.data.meldeschluss) > veranstaltung.meldeschluss) {
      throw new TRPCError({
        message: 'Der Meldeschluss darf nicht nach dem Meldeschluss der übergeordneten Veranstaltung liegen',
        code: 'BAD_REQUEST',
      })
    }

    const heroImages = crudFiles(
      input.landingSettings.addHeroImages,
      input.landingSettings.updateHeroImages,
      input.landingSettings.deleteHeroImageIds
    )

    const miscellaneousItems = crudMiscellaneousItems(
      input.landingSettings.addMiscellaneousItems,
      input.landingSettings.updateMiscellaneousItems,
      input.landingSettings.deleteMiscellaneousItemIds
    )

    return await prisma.unterveranstaltung.create({
      data: {
        veranstaltung: {
          connect: {
            id: input.data.veranstaltungId,
          },
        },
        maxTeilnehmende: input.data.maxTeilnehmende,
        teilnahmegebuehr: input.data.teilnahmegebuehr,
        meldebeginn: input.data.meldebeginn,
        meldeschluss: input.data.meldeschluss,
        beschreibung: input.data.beschreibung,
        bedingungen: input.data.bedingungen,
        type: 'GLIEDERUNG',
        gliederung: {
          connect: {
            id: gliederung.id,
          },
        },
        landingSettings: {
          create: {
            ...input.landingSettings,
            heroImages: heroImages,
            miscellaneousItems: miscellaneousItems,
          },
        },
      },
      select: {
        id: true,
      },
    })
  },
})
