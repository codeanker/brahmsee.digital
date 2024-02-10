import config from '../../../config'
import { sendMail } from '../../../util/mail'

export async function sendMailConfirmEmailRequest(data: { email: string; activationToken: string }) {
  const activationUrl = `${config.clientUrl}/registrierung/confirm/${data.activationToken}`
  await sendMail({
    to: data.email,
    subject: 'brahmsee.digital Bestätige deine E-Mail Adresse',
    categories: ['account', 'confirm'],
    html: `Bitte bestätige deine E-Mail Adresse, indem du auf folgenden Link klickst: <a href="${activationUrl}">${activationUrl}</a>`,
  })
}
