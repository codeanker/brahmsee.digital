/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs'
import { Browser, chromium, BrowserContext, firefox, webkit, Page } from 'playwright'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { login } from './helpers/login'

import { testUtils } from '@codeanker/api'

describe(`Feature: Login`, () => {
  let browser: Browser
  let context: BrowserContext
  let name = ''
  let data: Awaited<ReturnType<typeof testUtils.createMock>>
  beforeAll(async () => {
    name = `test-${chromium.name()}-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}`
    browser = await chromium.launch({ headless: true })
    context = await browser.newContext({ ignoreHTTPSErrors: true })
    await testUtils.cleanup()
    data = await testUtils.createMock()
  })
  afterAll(async () => {
    browser?.close()
    await testUtils.cleanup()
  })
  it('Der Standard Nutzer kann sich anmelden.', async () => {
    const page = await context.newPage()
    // login
    await login(page, {
      email: data.user.email,
      password: data.user.password,
    })
    await page.screenshot({ path: `${__dirname}/screenshots/${name}_login.png` })
  })
  it.skip('Passwort kann zurück gesetzt werden.', async () => {})
})
