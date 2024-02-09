import type { Page } from 'playwright'

export async function insertJwtToken(page: Page, token: string, letzteVeranstaltung: number) {
  await page.goto(`https://localhost:8080/login`)
  await page.waitForLoadState('domcontentloaded')
  const innerLocalStorage = await page.evaluateHandle(() => window.localStorage)
  await innerLocalStorage.evaluate((storage, data) => storage.setItem('jwt', data), token)
  await innerLocalStorage.evaluate(
    (storage, data) => storage.setItem('letzteVeranstaltung', data),
    letzteVeranstaltung.toString()
  )
}
