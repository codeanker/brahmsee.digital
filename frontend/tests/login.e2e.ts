/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs'
import { type Browser, chromium, type BrowserContext } from 'playwright'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import * as testUtils from '@codeanker/api/test'

describe(`Feature: Login`, () => {
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
  it('Der Standard Nutzer kann sich anmelden.', async () => {
    const page = await context.newPage()
    await page.goto(`https://localhost:8080/login`)
    await page.getByPlaceholder('E-Mail').click()
    await page.getByPlaceholder('E-Mail').fill(data.account.email)
    await page.getByPlaceholder('Passwort').click()
    await page.getByPlaceholder('Passwort').fill(data.accountPassword)
    await page.getByPlaceholder('Passwort').press('Enter')
    // await page.screenshot({ path: `${__dirname}/screenshots/${name}_login.png` })
    await vi.waitUntil(() => !page.url().includes('login'))
  })
  it.skip('Passwort kann zurück gesetzt werden.', async () => {})
})
