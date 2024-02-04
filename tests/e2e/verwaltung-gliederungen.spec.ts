import { expect, test } from '../fixtures'

import { login } from './helpers/login'

test.describe(`View: verwaltung/gliederungen`, () => {
  test('Gliederung auflisten', async ({ page, user }) => {
    await login(page, user)
    await page.getByRole('link', { name: 'Gliederungen' }).click()
    await expect(page.getByText('Ausbildungszentrum Bad')).toBeVisible()
    await expect(page).toHaveScreenshot()
  })
  test('Gliederung erstellen ist sichtbar', async ({ page, user }) => {
    await login(page, user)
    await page.getByRole('link', { name: 'Gliederungen' }).click()
    await page.getByRole('link', { name: 'Gliederung erstellen' }).click()
    await page.getByPlaceholder('Name').fill('ATest Gliederung')
    await page.getByPlaceholder('EDV').fill('000000')
    await page.getByRole('button', { name: 'Speichern' }).click()
    await expect(page.getByText('ATest Gliederung')).toBeVisible()
  })
  test('Gliederung details ansehen', async ({ page, user }) => {
    await login(page, user)
    await page.getByRole('link', { name: 'Gliederungen' }).click()
    await page.getByText('Ausbildungszentrum Bad').click()
    await page.getByPlaceholder('Name').fill('Ausbildungszentrum Bad 2')
    await page.getByPlaceholder('EDV').fill('000001')
    await page.getByRole('button', { name: 'Speichern' }).click()
    await expect(page.getByText('Ausbildungszentrum Bad 2')).toBeVisible()
    await expect(page.getByText('000001')).toBeVisible()
  })
})
