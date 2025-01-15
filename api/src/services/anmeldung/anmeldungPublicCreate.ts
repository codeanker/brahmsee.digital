import { TRPCError } from '@trpc/server'
import dayjs from 'dayjs'
import { z } from 'zod'

import prisma from '../../prisma.js'
import { customFieldValuesCreateMany, defineCustomFieldValues } from '../../types/defineCustomFieldValues.js'
import { definePublicMutateProcedure } from '../../types/defineProcedure.js'
import logActivity from '../../util/activity.js'
import { sendMail } from '../../util/mail.js'
import { personSchema, getPersonCreateData } from '../person/schema/person.schema.js'
import { randomUUID } from 'node:crypto'
import { sendMailConfirmEmailRequest } from '../account/helpers/sendMailConfirmEmailRequest.js'

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
  const account = await prisma.account.upsert({
    where: {
      email: input.data.email,
    },
    create: {
      email: input.data.email,
      role: 'USER',
      person: {
        create: personData,
      },
    },
    update: {},
    select: {
      id: true,
      personId: true,
      activatedAt: true,
      person: {
        select: {
          gliederung: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  // send confirmation email if new account has been created
  if (account.activatedAt === null) {
    const activationToken = randomUUID()
    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        activationToken,
      },
    })
    await sendMailConfirmEmailRequest(input.data.email, activationToken)
  }

  const anmeldung = await prisma.anmeldung.create({
    data: {
      unterveranstaltungId: unterveranstaltung.id,
      accountId: account.id,
      personId: account.personId,
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
  })

  await Promise.all([
    logActivity({
      type: 'CREATE',
      description: 'person created via public registration',
      subjectType: 'person',
      subjectId: account.personId,
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
      gliederung: account.person.gliederung!.name,
      veranstaltung: unterveranstaltung.veranstaltung.name,
      hostname: unterveranstaltung.veranstaltung.hostname!.hostname,
    },
  })

  return account
}

export const anmeldungPublicCreateProcedure = definePublicMutateProcedure({
  key: 'publicCreate',
  inputSchema: inputSchema,
  async handler(options) {
    await handle(options.input, true)
  },
})
