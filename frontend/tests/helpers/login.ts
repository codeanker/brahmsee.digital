import { Page } from 'playwright'

export async function login(page: Page, user: { email: string; password: string }) {
  await page.goto(`https://localhost.codeanker.com:8080/login`)
  await page.getByPlaceholder('E-Mail').click()
  await page.getByPlaceholder('E-Mail').fill(user.email)
  await page.getByPlaceholder('Passwort').click()
  await page.getByPlaceholder('Passwort').fill(user.password)
  await page.getByPlaceholder('Passwort').press('Enter')
  await page.getByRole('heading', { name: 'Hier kommt die Brahmsee Planung für 2024' }).isVisible()
}
