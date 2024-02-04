import { Page } from '../../fixtures'

export async function login(page: Page, user: { email: string; password: string }) {
  await page.goto('/login')
  await page.getByPlaceholder('E-Mail').click()
  await page.getByPlaceholder('E-Mail').fill(user.email)
  await page.getByPlaceholder('Passwort').click()
  await page.getByPlaceholder('Passwort').fill(user.password)
  await page.getByRole('button', { name: 'Anmelden' }).click()
  await page.waitForURL('/dashboard')
}
