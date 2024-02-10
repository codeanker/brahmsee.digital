/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs'
import { type Browser, chromium, type BrowserContext } from 'playwright'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { insertJwtToken } from './helpers/insertJwtToken'

import * as testUtils from '@codeanker/api/test'

describe(`View: verwaltung/gliederungen`, () => {
  let browser: Browser
  let context: BrowserContext
  let name = ''
  let data: Awaited<ReturnType<typeof testUtils.createMock>>
  const runId = (Math.random() + 1).toString(36).substring(7)

  beforeAll(async () => {
    name = `test-${chromium.name()}-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}`
    browser = await chromium.launch({ headless: true })
    context = await browser.newContext({ ignoreHTTPSErrors: true })
    data = await testUtils.createMock(runId)
  })
  afterAll(async () => {
    browser?.close()
    await testUtils.cleanup(runId)
  })
  it('Gliederung auflisten', async () => {
    const page = await context.newPage()
    await insertJwtToken(page, data.accessToken, data.veranstaltung.id)

    await page.goto(`https://localhost:8080/verwaltung/gliederungen/liste`)
    await vi.waitUntil(async () => (await page.getByText('DLRG Bundesverband').isVisible()) === true)
    // await page.screenshot({ path: `${__dirname}/screenshots/${name}_verwaltung-gliederung.png` })
  })
  it.skip('Gliederung erstellen ist sichtbar', async () => {
    const page = await context.newPage()
    await insertJwtToken(page, data.accessToken, data.veranstaltung.id)

    await page.goto(`https://localhost:8080/verwaltung/gliederungen/liste`)
    await page.getByRole('button', { name: 'Erstellen' }).click()
    await vi.waitUntil(async () => (await page.getByRole('button', { name: 'Speichern' }).isVisible()) === true)
    // await page.screenshot({ path: `${__dirname}/screenshots/${name}_verwaltung-gliederung-detail.png` })
  })
  it.skip('Gliederung details ansehen', async () => {
    const page = await context.newPage()
    await insertJwtToken(page, data.accessToken, data.veranstaltung.id)

    await page.goto(`https://localhost.codeanker.com:8080/verwaltung/gliederungen`)
    await page.getByText('DLRG Bundesverband').click()
    await vi.waitUntil(async () => (await page.getByLabel('Gliederung').isVisible()) === true)
    // await page.screenshot({ path: `${__dirname}/screenshots/${name}_verwaltung-gliederung-detail.png` })
  })
})
