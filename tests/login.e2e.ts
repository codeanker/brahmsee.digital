/* eslint-disable @typescript-eslint/no-unused-vars */
import { test } from '@playwright/test'

test.describe(`Feature: Login Email`, () => {
  // test.describe.configure({ mode: 'serial' })
  test('Erfolgreicher Login', async ({ page }) => {
    await page.goto('login')
    await page.getByPlaceholder('E-Mail').click()
    await page.getByPlaceholder('E-Mail').fill('admin@example.org')
    await page.getByPlaceholder('Passwort').click()
    await page.getByPlaceholder('Passwort').fill('admin')
    await page.getByRole('button', { name: 'Anmelden' }).click()
    await page.waitForURL(/^(?!.*login).*/g)
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
  test('Falsches Passwort', async ({ page }) => {
    await page.goto('login')
    await page.getByPlaceholder('E-Mail').click()
    await page.getByPlaceholder('E-Mail').fill('admin@example.org')
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

test.describe(`Feature: Login DLRG`, () => {})

test.describe(`Feature: Passwort vergessen`, () => {
  test.describe.configure({ mode: 'serial' })
  test.skip('Link erfolgreich', async ({ page }) => {})
  test.skip('Erfolgreiches einreichen', async ({ page }) => {})
  test.skip('Pflichtfeld', async ({ page }) => {})
})
