/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, mergeTests } from '@playwright/test'
import { fixtureAccountAdmin } from './fixtures/accountAdmin'

const test = mergeTests(fixtureAccountAdmin)

test.describe(`Feature Gliederung Ausschreibung`, () => {
  test.beforeEach(async ({ page, accountAdmin }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.evaluate((jwt) => localStorage.setItem('jwt', jwt), accountAdmin.accessToken)
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('Kann liste einsehen', async ({ page, accountAdmin }) => {
    await page.getByTestId('sidebaritem-Accounts').click()
    await expect(
      page.getByText('Hier findest Du alle Personen die sich zu Veranstaltungen angemeldet haben.')
    ).toBeVisible()
    // TODO: check if known person is in list
  })
  test('Kann erstellen', async ({ page }) => {
    await page.goto('/verwaltung/accounts/create')
    await page.waitForLoadState('networkidle')
    await page.getByTestId('BasicInput-Vorname').fill('Max')
    await page.getByTestId('BasicInput-Nachname').fill('Mustermensch')

    await page.getByTestId('BasicSelect-Geschlecht').click()
    await page.getByTestId('BasicSelect-Geschlecht-UNSPECIFIED').click()

    // Fill Geburtsdatum // TODO: improve datepicker with testid
    await page.getByRole('textbox', { name: 'Geburtsdatum auswählen' }).click()
    await page.getByRole('button', { name: 'Open years overlay' }).click()
    await page.locator('[data-test="2002"]').click()
    await page.getByRole('button', { name: 'Open months overlay' }).click()
    await page.locator('[data-test="Sep"]').click()
    await page.locator('[data-test="Mon Sep 09 2002 00:00:00 GMT+0200 (Mitteleuropäische Sommerzeit)"]').click()

    await page.getByTestId('BasicInput-accountEmail').fill('log+foo@codeanker.de')
    await page.getByTestId('BasicPassword-accountPassword').fill('foo')

    await page.getByTestId('BasicSelect-accountRole').click()
    await page.getByTestId('BasicSelect-accountRole-USER').click()

    await page.getByTestId('BasicDropdown-accountStatus').click()
    await page.getByTestId('BasicDropdown-accountStatus-AKTIV').click()

    await page.getByTestId('FormAccountGeneral-submit').click()
    await page.waitForLoadState('networkidle')

    expect(page.url()).not.toContain('/create')
  })
  test.skip('Kann details einsehen', async ({ page }) => {})
  test.skip('Kann bearbeiten', async ({ page }) => {})
})
