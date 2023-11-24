// import { expect } from '@playwright/test'
import { Page } from 'playwright'
import { vi } from 'vitest'

export async function login(page: Page, user: { email: string; password: string }) {
  await page.goto(`https://localhost.codeanker.com:8080/login`)
  await page.getByPlaceholder('E-Mail').click()
  await page.getByPlaceholder('E-Mail').fill(user.email)
  await page.getByPlaceholder('Passwort').click()
  await page.getByPlaceholder('Passwort').fill(user.password)
  await page.getByPlaceholder('Passwort').press('Enter')
  await vi.waitUntil(() => !page.url().includes('login'))
}
