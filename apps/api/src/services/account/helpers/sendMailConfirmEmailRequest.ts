import config from '../../../config.js'
import type { BaseContext } from '../../../context.js'
import { sendMail } from '../../../util/mail.js'

type Props = {
  email: string
  activationToken: string
}

export async function sendMailConfirmEmailRequest({ prisma }: BaseContext, { activationToken, email }: Props) {
  const activationUrl = `${config.clientUrl}/registrierung/confirm/${activationToken}`

  const account = await prisma.account.findUniqueOrThrow({
    where: {
      email,
    },
    select: {
      person: {
        select: {
          firstname: true,
          lastname: true,
          gliederung: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  await sendMail({
    to: email,
    subject: 'Bestätige deine E-Mail Adresse',
    categories: ['account', 'confirm'],
    template: 'account-email-confirm',
    variables: {
      name: `${account.person.firstname} ${account.person.lastname}`,
      gliederung: account.person.gliederung!.name,
      hostname: 'brahmsee.digital',
      veranstaltung: 'brahmsee.digital',
      activationUrl,
    },
  })
}
