import config from '../../../config'
import { sendMail } from '../../../util/mail'

export async function sendMailConfirmEmailRequest(
  data: { email: string; activationTokens: string | string[] },
  isPublic: boolean
) {
  const activationUrl = `${config.clientUrl}/${isPublic ? 'ausschreibung' : 'registrierung'}/confirm/${Array.isArray(data.activationTokens) ? data.activationTokens.join('/') : data.activationTokens}`
  await sendMail({
    to: data.email,
    subject: 'brahmsee.digital Bestätige deine E-Mail Adresse',
    categories: ['account', 'confirm'],
    html: `Bitte bestätige deine E-Mail Adresse, indem du auf folgenden Link klickst: <a href="${activationUrl}">${activationUrl}</a>`,
  })
}
