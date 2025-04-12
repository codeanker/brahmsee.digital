import { test, expect } from '@playwright/test'

test.describe(`Feature: Development Mitwirkende`, () => {
  test('Mitwirkende einsehbar', async ({ page }) => {
    await page.goto('/development/mitwirkende')
    await expect(page.getByText('Vielen Dank an alle Contributor:innen und Sponsoren')).toBeVisible()
    await expect(page.getByText('Momme Jürgensen')).toBeVisible()
  })

  test.skip('Datenschutz-link ist auf einer eingeloggten Seite', async ({ page }) => {})
  test.skip('Impressum-link ist auf einer eingeloggten Seite', async ({ page }) => {})
})
