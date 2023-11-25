/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs'
import { Browser, chromium, BrowserContext, firefox, webkit, Page } from 'playwright'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { insertJwtToken } from './helpers/insertJwtToken'

import { testUtils } from '@codeanker/api'

describe(`View: verwaltung/benutzer`, () => {
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
  it('Ist View angelegt', async () => {
    const page = await context.newPage()
    await insertJwtToken(page, data.accessToken)

    await page.goto(`https://localhost.codeanker.com:8080/verwaltung/benutzer`)
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: `${__dirname}/screenshots/${name}_verwaltung-benutzer.png` })
  })
})
