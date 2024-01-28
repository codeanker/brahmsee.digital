import { AnmeldungStatus, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin'
import { sendMail } from '../../util/mail'

export const anmeldungVerwaltungStornoProcedure = defineProcedure({
  key: 'verwaltungStorno',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN] },
  inputSchema: z.strictObject({
    anmeldungId: z.number().int(),
  }),
  async handler(options) {
    type AnmeldungWhereUniqueInput = Parameters<typeof prisma.anmeldung.update>[0]['where']
    const where: AnmeldungWhereUniqueInput = { id: options.input.anmeldungId }

    const anmeldung = await prisma.anmeldung.findUnique({
      where,
      select: {
        status: true,
        unterveranstaltung: {
          select: {
            veranstaltung: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    if (anmeldung?.status === AnmeldungStatus.STORNIERT) {
      return "Status ist bereits 'STORNIERT'"
    }

    if (options.ctx.account.role !== Role.ADMIN) {
      const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)
      where.unterveranstaltung = {
        gliederungId: gliederung.id,
      }
    }

    const res = await prisma.anmeldung.update({
      where,
      data: {
        status: AnmeldungStatus.STORNIERT,
      },
    })
    if (res.status == AnmeldungStatus.STORNIERT) {
      const person = await prisma.person.findUnique({
        where: {
          id: res.personId,
        },
        select: {
          firstname: true,
          lastname: true,
          email: true,
        },
      })
      if (!person) {
        throw new Error('Person not found')
      }
      sendMail({
        to: person.email,
        subject: 'Anmeldung storniert',
        categories: ['anemldung', 'storno'],
        html: `Hallo ${person.firstname} ${person.lastname},\n\n\nDeine Anmeldung für ${anmeldung?.unterveranstaltung.veranstaltung.name} wurde storniert.\n\nViele Grüße,\nDein Orga-Team`,
      })
      return {
        success: true,
      }
    }
  },
})
