import { TRPCError } from '@trpc/server'
import dayjs from 'dayjs'
import { z } from 'zod'

import prisma from '../../prisma'
import { customFieldValuesCreateMany, defineCustomFieldValues } from '../../types/defineCustomFieldValues'
import { defineProcedure } from '../../types/defineProcedure'
import logActivity from '../../util/activity'
import { sendMail } from '../../util/mail'
import { personSchema, getPersonCreateData } from '../person/schema/person.schema'

export const inputSchema = z.strictObject({
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

export async function handle(input: z.infer<typeof inputSchema>, isPublic: boolean) {
  const unterveranstaltung = await prisma.unterveranstaltung.findUniqueOrThrow({
    where: {
      id: input.data.unterveranstaltungId,
    },
    select: {
      id: true,
      meldeschluss: true,
      veranstaltung: {
        select: {
          id: true,
          name: true,
          hostname: {
            select: {
              hostname: true,
            },
          },
        },
      },
    },
  })

  if (isPublic && dayjs().isAfter(unterveranstaltung.meldeschluss)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Meldeschluss erreicht',
    })
  }

  const personData = await getPersonCreateData(input.data)

  const person = await prisma.person.create({
    data: {
      ...personData,
      anmeldungen: {
        create: {
          unterveranstaltungId: unterveranstaltung.id,
          mahlzeiten: input.data.mahlzeitenIds
            ? {
                connect: input.data.mahlzeitenIds.map((id) => ({
                  id,
                })),
              }
            : undefined,
          uebernachtungsTage: input.data.uebernachtungsTage,
          tshirtBestellt: input.data.tshirtBestellt,
          comment: input.data.comment,
          createdAt: new Date(),
          customFieldValues: {
            createMany: customFieldValuesCreateMany(input.customFieldValues),
          },
        },
      },
    },
    select: {
      id: true,
      anmeldungen: {
        take: 1,
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

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
      subjectId: person.anmeldungen[0].id,
    }),
  ])

  await sendMail({
    to: input.data.email,
    subject: `${unterveranstaltung?.veranstaltung?.hostname?.hostname} Anmeldung erfolgreich`,
    categories: ['anmeldung', 'create'],
    html: `Vielen Dank für deine Anmeldung zur Veranstaltung ${unterveranstaltung.veranstaltung.name} .`,
  })

  return person
}

export const anmeldungPublicCreateProcedure = defineProcedure({
  key: 'publicCreate',
  method: 'mutation',
  protection: { type: 'public' },
  inputSchema: inputSchema,
  async handler(options) {
    await handle(options.input, true)
  },
})
