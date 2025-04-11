import { readFile } from 'fs/promises'
import { join } from 'path'

import sgMail from '@sendgrid/mail'
import { getProperty } from 'dot-prop'
import Handlebars from 'handlebars'
import mjml2html from 'mjml'

import config from '.././config.js'
import { logger } from '../logger.js'

import logActivity from './activity.js'

sgMail.setApiKey(config.mail.sendgridApiKey)

type Variables = Record<string, unknown> & {
  name: string
  gliederung: string
  veranstaltung: string
  hostname: string
}

type EMailParams = {
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
  template: string
  variables: Variables
}

type EMail = {
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

async function readTemplate(name: string) {
  const abs = `${join(templateDirectory, name)}.mjml`
  const buffer = await readFile(abs)
  const contents = buffer.toString('utf8')

  return { abs, contents }
}

Handlebars.registerHelper('year', () => new Date().getFullYear())
Handlebars.registerHelper('config', (key) => getProperty(config, key))
Handlebars.registerHelper('url', (path) => `${config.clientUrl}/${path}`)

const templateDirectory = join(process.cwd(), 'email')
const { contents: layout } = await readTemplate('_layout')
Handlebars.registerPartial('layout', layout)

/**
 * Triggers the email template compilation pipeline consisting of the following:
 *
 * - Use `ejs` as a templating engine for enabling variable support.
 * - Use `mjml` to generate the raw html code to embed in the email.
 */
async function compile(templateName: string, variables: Variables): Promise<string | null> {
  const { abs, contents } = await readTemplate(templateName)
  const template = Handlebars.compile(contents, {
    strict: true,
  })
  const mjml = template(variables)
  const result = mjml2html(mjml, {
    filePath: abs,
  })

  const { errors, html } = result

  if (errors.length > 0) {
    logger.error('Failed compiling mjml email template!', { errors })
    return null
  }

  return html
}

export async function sendMail(mailParams: EMailParams) {
  try {
    let subject = mailParams.subject
    const sendWithTemplate = 'no-template'

    // set mail categories for sendgrid
    const categories = [
      process.env.NODE_ENV ?? '',
      process.env.VERSION ?? '',
      sendWithTemplate,
      ...mailParams.categories,
    ]

    let html = await compile(mailParams.template, {
      ...mailParams.variables,
      subject,
    })
    if (html === null) {
      return
    }

    // convert umlaute to html entires
    if (!mailParams.skipHtmlEncode) {
      html = encodeHtmlEntries(html)
    }

    if (process.env.NODE_ENV != 'production') {
      subject += ` [${process.env.NODE_ENV}]`
    }

    const mailToSend: EMail = {
      from: `${mailParams.variables.hostname}<noreply@brahmsee.digital>`,
      to: parseMaybeArray(mailParams.to),
      attachments: formatAttachments(mailParams.attachments),
      subject,
      categories,
      html,
    }

    await logActivity({
      type: 'EMAIL',
      description: mailParams.subject,
      subjectType: '',
      metadata: mailParams,
    })

    const to = Array.isArray(mailToSend.to) ? mailToSend.to.join(', ') : mailToSend.to
    const bcc = mailToSend.bcc ? (Array.isArray(mailToSend.bcc) ? mailToSend.bcc.join(', ') : mailToSend.bcc) : ''
    // send mail
    if (config.mail.sendMails === 'true' && config.mail.sendgridApiKey) {
      console.log(`sending mail (${sendWithTemplate}) to "${to}" with subject "${mailParams.subject}"`)
      return await sgMail.sendMultiple(mailToSend)
    } else {
      console.log('///////////////////////////////////////')
      console.log('Sending Email')
      console.log(`from: ${mailToSend.from}`)
      console.log(`to: ${to}`)
      if (mailToSend.bcc) console.log(`bcc: ${bcc}`)
      console.log(`subject: ${mailToSend.subject}`)
      console.log(mailToSend.html)
      console.log('////////////////////////////////////////')

      return mailToSend
    }
  } catch (error: unknown) {
    console.error(error)
    if (error instanceof Error) {
      logger.error('Failed sending email!', {
        message: error.message,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        response: (error as any)?.response?.body,
      })
    } else {
      logger.error('Failed sending email!', {
        message: 'Unknown error',
      })
    }
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
