/* eslint-disable no-unused-vars */
import sgMail from '@sendgrid/mail'

import config from '.././config'

import logActivity from './activity'

sgMail.setApiKey(config.mail.sendgridApiKey)

type EMailTemplateConfig = {
  html: string
  template?: undefined
}
/** Die EMail wie sie an den Service übergeben wird */
export type EMailParams = EMailTemplateConfig & {
  to: string | string[]
  bcc?: string | string[]
  subject: string
  categories: string[]
  attachments?: {
    content: string | Buffer
    filename: string
    type: string
  }[]
  skipHtmlEncode?: boolean
}

/** Die EMail wie sie an den Sendgrid Service übergeben wird */
export type EMail = {
  from: string
  to: string[]
  bcc?: string[]
  subject: string
  html: string
  categories: string[]
  attachments: {
    content: string
    filename: string
    type: string
  }[]
}

export async function sendMail(mailParams: EMailParams) {
  try {
    let html
    let subject = mailParams.subject
    const sendWithTemplate = 'no-template'
    if (mailParams.html) {
      html = mailParams.html
    }
    // set mail categories for sendgrid
    const categories = [
      process.env.NODE_ENV ?? '',
      process.env.VERSION ?? '',
      sendWithTemplate,
      ...mailParams.categories,
    ]

    if (process.env.NODE_ENV != 'production') {
      subject += ' [DEV]'
      html += `<br><br>
        Testnachricht, versendet aus folgendem System: ${process.env.NODE_ENV}`
    }
    // convert umlaute to html entires
    if (!mailParams.skipHtmlEncode) html = encodeHtmlEntries(html)
    const mailToSend: EMail = {
      from: 'brahmsee.digital<noreply@brahmsee.digital>',
      to: parseMaybeArray(mailParams.to),
      subject,
      categories,
      html: html,
      attachments: formatAttachments(mailParams.attachments),
    }

    await logActivity({
      type: 'EMAIL',
      description: mailParams.subject,
      subjectType: '',
      metadata: mailParams,
    })

    // send mail
    if (config.mail.sendMails === 'true' && config.mail.sendgridApiKey) {
      // eslint-disable-next-line no-console
      console.log(`sending mail (${sendWithTemplate}) to "${mailParams.to}" with subject "${mailParams.subject}"`)
      return await sgMail.sendMultiple(mailToSend)
    } else {
      /* eslint-disable no-console */
      console.log('///////////////////////////////////////')
      console.log('Sending Email')
      console.log(`from: ${mailToSend.from}`)
      console.log(`to: ${mailToSend.to}`)
      if (mailToSend.bcc) console.log(`bcc: ${mailToSend.bcc}`)
      console.log(`subject: ${mailToSend.subject}`)
      console.log(mailToSend.html)
      console.log('////////////////////////////////////////')
      /* eslint-enable no-console */
      return mailToSend
    }
  } catch (error: any) {
    console.error(error)
    if (error.response?.body) console.error(error.response.body)
  }
}

function encodeHtmlEntries(html: string): string {
  return html
    .replaceAll('ä', '&auml;')
    .replaceAll('Ä', '&Auml;')
    .replaceAll('ö', '&ouml;')
    .replaceAll('Ö', '&Ouml;')
    .replaceAll('ü', '&uuml;')
    .replaceAll('Ü', '&Uuml;')
    .replaceAll('ß', '&szlig;')
}

function formatAttachments(
  attachments: { content: string | Buffer; filename: string; type: string }[] | undefined
): { content: string; filename: string; type: string }[] {
  if (!attachments) return []

  return attachments.map((attachment) => {
    if (Buffer.isBuffer(attachment.content)) {
      return {
        ...attachment,
        content: attachment.content.toString('base64'),
      }
    } else if (typeof attachment.content === 'string') {
      return {
        ...attachment,
        content: attachment.content,
      }
    } else {
      throw new Error('Attachment content is not a string or buffer')
    }
  })
}

function parseMaybeArray(maybeArray?: string | string[]): string[] {
  if (maybeArray === undefined) return []
  if (Array.isArray(maybeArray)) {
    return maybeArray
  } else {
    return [maybeArray]
  }
}
