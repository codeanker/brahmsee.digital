import config from '../../../config'
import client from '../../../prisma'
import { sendMail } from '../../../util/mail'

export async function sendMailConfirmEmailRequest(email: string, activationToken: string) {
  const activationUrl = `${config.clientUrl}/registrierung/confirm/${activationToken}`

  const account = await client.account.findUniqueOrThrow({
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
      activationUrl,
    },
  })
}
