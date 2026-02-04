import z from 'zod'

import prisma from '../../prisma.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'
import { listFaqs } from '../faqs/faqListProcedure.js'
import { getFileUrl } from '../file/helpers/getFileUrl.js'

export const unterveranstaltungPublicGetProcedure = definePublicQueryProcedure({
  key: 'publicGet',
  inputSchema: z.strictObject({
    id: z.string().uuid(),
  }),
  async handler({ input }) {
    const unterveranstaltung = await prisma.unterveranstaltung.findUniqueOrThrow({
      where: {
        id: input.id,
      },
      select: {
        id: true,
        veranstaltungId: true,
        meldebeginn: true,
        meldeschluss: true,
        maxTeilnehmende: true,
        teilnahmegebuehr: true,
        type: true,
        veranstaltung: {
          select: {
            name: true,
            beginn: true,
            ende: true,
            ort: {
              select: {
                name: true,
              },
            },
            datenschutz: true,
            teilnahmeBedingungen: true,
            teilnahmeBedingungenPublic: true,
            zielgruppe: true,
            hostname: true,
          },
        },
        gliederung: {
          select: {
            id: true,
            name: true,
          },
        },
        landingSettings: {
          select: {
            heroTitle: true,
            heroSubtitle: true,
            heroImages: {
              select: {
                fileId: true,
                name: true,
                file: true,
              },
            },
            eventDetailsTitle: true,
            eventDetailsContent: true,
            miscellaneousVisible: true,
            miscellaneousTitle: true,
            miscellaneousSubtitle: true,
            miscellaneousItems: {
              select: {
                title: true,
                content: true,
              },
            },
            faqVisible: true,
            faqEmail: true,
            instagramVisible: true,
            instagramUrl: true,
            facebookVisible: true,
            facebookUrl: true,
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
        beschreibung: true,
        bedingungen: true,
        documents: {
          select: {
            name: true,
            fileId: true,
          },
        },
      },
    })

    const heroImages = await Promise.all(
      unterveranstaltung.landingSettings?.heroImages.map(async (image) => {
        return {
          ...image.file,
          url: await getFileUrl(image.file),
        }
      }) ?? []
    )

    const faqs = await listFaqs(input.id)

    return {
      ...unterveranstaltung,
      heroImages,
      faqs,
    }
  },
})
