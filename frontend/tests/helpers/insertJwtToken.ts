import { Page } from 'playwright'

export async function insertJwtToken(page: Page, token: string) {
  await page.goto(`https://localhost.codeanker.com:8080/login`)
  await page.waitForLoadState('domcontentloaded')
  const innerLocalStorage = await page.evaluateHandle(() => window.localStorage)
  await innerLocalStorage.evaluate((storage, data) => storage.setItem('jwt', data), token)
}
