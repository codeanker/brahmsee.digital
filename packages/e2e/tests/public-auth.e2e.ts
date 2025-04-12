/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, mergeTests } from '@playwright/test'
import { fixtureAccountAdmin } from './fixtures/accountAdmin'

const test = mergeTests(fixtureAccountAdmin)

test.describe(`Feature: Login Email`, () => {
  test('Erfolgreicher Login', async ({ page, accountAdmin }) => {
    await page.goto('/login')
    await page.getByPlaceholder('E-Mail').click()
    await page.getByPlaceholder('E-Mail').fill(accountAdmin.account.email)
    await page.getByPlaceholder('Passwort').click()
    await page.getByPlaceholder('Passwort').fill(accountAdmin.accountPassword)
    await page.getByRole('button', { name: 'Anmelden' }).click()
    await page.waitForLoadState('networkidle')

    const jwt = await page.evaluate(() => localStorage.getItem('jwt'))
    expect(jwt).not.toBeNull()
  })
  test('Falscher Nutzername', async ({ page }) => {
    await page.goto('login')
    await page.getByPlaceholder('E-Mail').click()
    await page.getByPlaceholder('E-Mail').fill('super seriöser admin')
    await page.getByPlaceholder('Passwort').click()
    await page.getByPlaceholder('Passwort').fill('admin')
    await page.getByRole('button', { name: 'Anmelden' }).click()
    await page.getByText('No Account found').isVisible()
  })
  test('Falsches Passwort', async ({ page, accountAdmin }) => {
    await page.goto('login')
    await page.getByPlaceholder('E-Mail').click()
    await page.getByPlaceholder('E-Mail').fill(accountAdmin.account.email)
    await page.getByPlaceholder('Passwort').click()
    await page.getByPlaceholder('Passwort').fill('ein falsches Passwort')
    await page.getByRole('button', { name: 'Anmelden' }).click()
    await page.getByText('Email or password is incorrect').isVisible()
  })
  test('Pflichtfeld', async ({ page }) => {
    await page.goto('login')
    await page.getByRole('button', { name: 'Anmelden' }).click()
    await page.getByText('Das Feld email ist ein Pflichtfeld').isVisible()
    await page.getByText('Das Feld password ist ein Pflichtfeld').isVisible()
  })
})

test.describe(`Feature: Gliederung registrierungsanfrage`, () => {
  test.skip('Erfolgreicher', async ({ page, accountAdmin }) => {})
})

test.describe(`Feature: Via einem activationToken seinenden Nutzer aktivieren.`, () => {
  test.skip('Erfolgreich', async ({ page }) => {})
})

test.describe(`Feature: Logout`, () => {
  test.skip('Erfolgreich', async ({ page }) => {})
})

test.describe(`Feature: Passwort vergessen`, () => {
  test.describe.configure({ mode: 'serial' })
  test.skip('Link erfolgreich', async ({ page }) => {})
  test.skip('Erfolgreiches einreichen', async ({ page }) => {})
  test.skip('Pflichtfeld', async ({ page }) => {})
})
