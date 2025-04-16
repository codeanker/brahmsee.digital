/* eslint-disable @typescript-eslint/no-unused-vars */
import { getLastActivity } from '@codeanker/api/test'
import { expect, mergeTests } from '@playwright/test'
import { fixtureAccountAdmin } from './fixtures/accountAdmin'

const test = mergeTests(fixtureAccountAdmin)

test.describe(`Als Admin aktivität einsehen`, () => {
  test.beforeEach(async ({ page, accountAdmin }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.evaluate((jwt) => localStorage.setItem('jwt', jwt), accountAdmin.accessToken)
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('Kann liste einsehen', async ({ page }) => {
    await page.getByTestId('sidebaritem-Aktivität').click()
    await expect(
      page.getByText(
        ' In der Verwaltung werden Aktivitäten aufgezeichnet, z.B. wenn Accounts erstellt oder gelöscht werden.'
      )
    ).toBeVisible()
    const lastActivity = await getLastActivity()
    expect(lastActivity).toBeTruthy()
    await expect(
      page
        .getByTestId('DataGridVirtualList')
        .first()
        .getByText(`${lastActivity!.subjectType} #${lastActivity!.subjectId}`)
        .last()
    ).toBeVisible()
  })
})
