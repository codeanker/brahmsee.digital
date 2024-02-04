import { expect, test } from '../fixtures'

import { login } from './helpers/login'

test.describe(`View: verwaltung/benutzer`, () => {
  test('Ist View angelegt', async ({ page, user }) => {
    await login(page, user)
    await page.getByRole('link', { name: 'Personen' }).click()
    // check if demo user is in table
    await expect(page.getByText('Steffen Super')).toBeVisible()
    await expect(page).toHaveScreenshot()
  })
})
