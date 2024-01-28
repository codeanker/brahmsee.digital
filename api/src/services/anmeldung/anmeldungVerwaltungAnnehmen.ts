import { AnmeldungStatus } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin'
import { sendMail } from '../../util/mail'

export const anmeldungVerwaltungAnnehmenProcedure = defineProcedure({
  key: 'verwaltungAnnehmen',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'] },
  inputSchema: z.strictObject({
    anmeldungId: z.number().int(),
  }),
  async handler(options) {
    type AnmeldungWhereUniqueInput = Parameters<typeof prisma.anmeldung.update>[0]['where']
    const where: AnmeldungWhereUniqueInput = { id: options.input.anmeldungId }

    if (options.ctx.account.role !== 'ADMIN') {
      const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)
      where.unterveranstaltung = {
        gliederungId: gliederung.id,
      }
    }
    const res = await prisma.anmeldung.update({
      where,
      data: {
        status: AnmeldungStatus.BESTAETIGT,
      },
    })
    if (res.status == AnmeldungStatus.BESTAETIGT) {
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
        subject: 'Anmeldung bestätigt',
        categories: ['anemldung', 'bestaetigung'],
        html: `Hallo ${person.firstname} ${person.lastname},\n\n\nDeine Anmeldung wurde bestätigt.\n\nViele Grüße,\nDein Orga-Team`,
      })
      return {
        success: true,
      }
    }
  },
})
