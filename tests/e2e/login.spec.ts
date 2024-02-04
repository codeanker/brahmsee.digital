/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs'

import { expect, test } from '../fixtures'

test.describe(`Feature: Login`, () => {
  test('Der Standard Nutzer kann sich anmelden.', async ({ page, user }) => {
    await page.goto('/login')
    await page.getByPlaceholder('E-Mail').click()
    await page.getByPlaceholder('E-Mail').fill(user.email)
    await page.getByPlaceholder('Passwort').click()
    await page.getByPlaceholder('Passwort').fill(user.password)

    await expect(page).toHaveScreenshot()

    await page.getByPlaceholder('Passwort').press('Enter')
    await expect(page.getByRole('heading', { name: 'Aktuelle Veranstaltungen' })).toBeVisible()
  })
  test.skip('Passwort kann zurück gesetzt werden.', async () => {})
})
