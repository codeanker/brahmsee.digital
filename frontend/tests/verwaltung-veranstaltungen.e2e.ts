/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs'
import { type Browser, chromium, type BrowserContext } from 'playwright'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import * as testUtils from '@codeanker/api/test'

describe(`View: verwaltung/veranstaltungen`, () => {
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
  it.skip('Write tests.', async () => {})
})
