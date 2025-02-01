import { TRPCError } from '@trpc/server'
import dayjs from 'dayjs'
import { z } from 'zod'

import prisma from '../../prisma.js'
import { customFieldValuesCreateMany, defineCustomFieldValues } from '../../types/defineCustomFieldValues.js'
import { definePublicMutateProcedure } from '../../types/defineProcedure.js'
import logActivity from '../../util/activity.js'
import { sendMail } from '../../util/mail.js'
import { getPersonCreateData, personSchema } from '../person/schema/person.schema.js'
import type { Context } from '../../context.js'
import { randomUUID } from 'node:crypto'

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

type HandleProps = {
  ctx: Context
  input: z.infer<typeof inputSchema>
  isPublic: boolean
}

export async function handle({ ctx, input, isPublic }: HandleProps) {
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
      gliederung: {
        select: {
          name: true,
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
    data: personData,
    select: {
      id: true,
    },
  })

  const assignmentCode = ctx.accountId === undefined ? randomUUID() : null
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
      assignmentCode,
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
      assignmentCode,
    },
  })
}

export const anmeldungPublicCreateProcedure = definePublicMutateProcedure({
  key: 'publicCreate',
  inputSchema: inputSchema,
  async handler({ ctx, input }) {
    await handle({ ctx, input, isPublic: true })
  },
})
