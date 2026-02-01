import { AnmeldungStatus, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import logActivity from '../../util/activity.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'
import { sendMail } from '../../util/mail.js'

export const anmeldungVerwaltungAnnehmenProcedure = defineProtectedMutateProcedure({
  key: 'verwaltungAnnehmen',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    anmeldungId: z.string().uuid(),
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
                hostname: {
                  select: {
                    hostname: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (anmeldung?.status === AnmeldungStatus.BESTAETIGT) {
      return "Status ist bereits 'BESTAETIGT'"
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
        status: AnmeldungStatus.BESTAETIGT,
      },
    })

    await logActivity({
      type: 'UPDATE',
      description: `registration approved`,
      subjectType: 'anmeldung',
      subjectId: res.id,
      causerId: options.ctx.accountId,
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
          gliederung: {
            select: {
              name: true,
            },
          },
        },
      })
      if (!person) {
        throw new Error('Person not found')
      }
      await sendMail({
        to: person.email,
        subject: 'Anmeldung bestätigt',
        categories: ['anemldung', 'bestaetigung'],
        template: 'registration-confirmed',
        variables: {
          name: `${person.firstname} ${person.lastname}`,
          gliederung: person.gliederung!.name,
          veranstaltung: anmeldung!.unterveranstaltung.veranstaltung.name,
          hostname: anmeldung!.unterveranstaltung.veranstaltung.hostname!.hostname,
        },
      })
      return {
        success: true,
      }
    }
  },
})
