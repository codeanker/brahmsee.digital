/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from '@playwright/test'

test.describe(`Page: Datenschutz und Impressum`, () => {
  test('Datenschutz', async ({ page }) => {
    await page.goto('/public/datenschutz')
    await expect(page.getByTestId('datenschutz-heading')).toBeVisible()
    await expect(page.getByTestId('datenschutz-text')).toBeVisible()
  })
  test('Impressum', async ({ page }) => {
    await page.goto('/public/impressum')
    await expect(page.getByTestId('impressum-heading')).toBeVisible()
    await expect(page.getByTestId('impressum-text')).toBeVisible()
  })
  test.skip('Datenschutz-Link auf login seite', async ({ page }) => {})
  test.skip('Imoressum-Link auf login seite', async ({ page }) => {})
})
