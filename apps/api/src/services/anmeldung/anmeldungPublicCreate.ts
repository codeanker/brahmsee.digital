import { TRPCError } from '@trpc/server'
import dayjs from 'dayjs'
import { z } from 'zod'

import { randomUUID } from 'node:crypto'
import prisma from '../../prisma.js'
import { customFieldValuesCreateMany, defineCustomFieldValues } from '../../types/defineCustomFieldValues.js'
import { definePublicMutateProcedure } from '../../types/defineProcedure.js'
import logActivity from '../../util/activity.js'
import { sendMail } from '../../util/mail.js'
import { getPersonCreateData, personSchema } from '../person/schema/person.schema.js'
import { updateMeiliPerson } from '../../meilisearch/person.js'

export const inputSchema = z.strictObject({
  token: z.string().optional(),
  data: personSchema.extend({
    unterveranstaltungId: z.number().int(),
    mahlzeitenIds: z.array(z.number().int()).optional(),
    uebernachtungsTage: z.array(z.date()).optional(),
    tshirtBestellt: z.boolean().optional(),
    email: z.string().email(),
    comment: z.string().optional(),
  }),
  customFieldValues: defineCustomFieldValues(),
})

export const anmeldungPublicCreateProcedure = definePublicMutateProcedure({
  key: 'publicCreate',
  inputSchema,
  handler: async ({ ctx, input }) => {
    const unterveranstaltung = await prisma.unterveranstaltung.findUniqueOrThrow({
      where: {
        id: input.data.unterveranstaltungId,
      },
      select: {
        id: true,
        meldeschluss: true,
        maxTeilnehmende: true,
        veranstaltung: {
          select: {
            id: true,
            name: true,
            hostname: {
              select: {
                hostname: true,
              },
            },
            maxTeilnehmende: true,
            unterveranstaltungen: {
              select: {
                _count: {
                  select: {
                    Anmeldung: {
                      where: {
                        status: 'BESTAETIGT',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        gliederung: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            Anmeldung: {
              where: {
                status: 'BESTAETIGT',
              },
            },
          },
        },
      },
    })

    const anmeldeLink = await prisma.anmeldungLink.findFirst({
      where: {
        accessToken: input.token,
        unterveranstaltungId: unterveranstaltung.id,
        usedAt: null,
      },
      select: {
        id: true,
      },
    })

    // skip validations if a valid bypass link is being used
    if (anmeldeLink === null) {
      if (dayjs().isAfter(unterveranstaltung.meldeschluss)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Meldeschluss erreicht',
        })
      }

      const activeAnmeldungenGlobal = unterveranstaltung.veranstaltung.unterveranstaltungen.reduce(
        (prev, curr) => prev + curr._count.Anmeldung,
        0
      )
      if (
        activeAnmeldungenGlobal >= unterveranstaltung.veranstaltung.maxTeilnehmende ||
        unterveranstaltung._count.Anmeldung >= unterveranstaltung.veranstaltung.maxTeilnehmende ||
        unterveranstaltung._count.Anmeldung >= unterveranstaltung.maxTeilnehmende
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Maximale Anzahl an Anmeldungen ist bereits erreicht!',
        })
      }
    }

    const personData = await getPersonCreateData(input.data)
    const person = await prisma.person.create({
      data: personData,
      select: {
        id: true,
        firstname: true,
        lastname: true,
        birthday: true,
        email: true,
        gliederung: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    await updateMeiliPerson({
      id: person.id,
      firstname: person.firstname,
      lastname: person.lastname,
      birthday: person.birthday,
      email: person.email,
      gliederung: person.gliederung,
    })

    const accessToken = randomUUID()
    const assignmentCode = ctx.authenticated ? null : randomUUID()
    const anmeldung = await prisma.anmeldung.create({
      data: {
        unterveranstaltungId: unterveranstaltung.id,
        accountId: ctx.accountId,
        personId: person.id,
        mahlzeiten: input.data.mahlzeitenIds
          ? {
              connect: input.data.mahlzeitenIds.map((id) => ({
                id,
              })),
            }
          : undefined,
        uebernachtungsTage: input.data.uebernachtungsTage,
        comment: input.data.comment,
        createdAt: new Date(),
        customFieldValues: {
          createMany: customFieldValuesCreateMany(input.customFieldValues),
        },
        accessToken,
        assignmentCode,
      },
    })

    if (anmeldeLink !== null) {
      await prisma.anmeldungLink.update({
        where: {
          id: anmeldeLink.id,
        },
        data: {
          anmeldungId: anmeldung.id,
          usedAt: new Date(),
        },
      })
    }

    await Promise.all([
      logActivity({
        type: 'CREATE',
        description: 'person created via public registration',
        subjectType: 'person',
        subjectId: person.id,
      }),
      logActivity({
        type: 'CREATE',
        description: 'new public registration',
        subjectType: 'anmeldung',
        subjectId: anmeldung.id,
      }),
    ])

    await sendMail({
      to: input.data.email,
      subject: `${unterveranstaltung?.veranstaltung?.hostname?.hostname} Anmeldung erfolgreich`,
      categories: ['anmeldung', 'create'],
      template: 'registration-successful',
      variables: {
        name: `${personData.firstname} ${personData.lastname}`,
        gliederung: unterveranstaltung.gliederung.name,
        veranstaltung: unterveranstaltung.veranstaltung.name,
        hostname: unterveranstaltung.veranstaltung.hostname!.hostname,
        unterveranstaltungId: unterveranstaltung.id,
        anmeldungId: anmeldung.id,
        assignmentCode,
        accessToken,
      },
    })
  },
})
