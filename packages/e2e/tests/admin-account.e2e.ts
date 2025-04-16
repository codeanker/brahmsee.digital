/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, mergeTests } from '@playwright/test'
import { fixtureAccountAdmin } from './fixtures/accountAdmin'
import { getAccountById, getAccountByName } from '@codeanker/api/test'
import { fixtureAccountGliederungAdmin } from './fixtures/accountGliederungAdmin'
import { faker } from '@faker-js/faker'

const test = mergeTests(fixtureAccountAdmin)

test.describe(`Als Admin accounts verwalten`, () => {
  test.beforeEach(async ({ page, accountAdmin }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.evaluate((jwt) => localStorage.setItem('jwt', jwt), accountAdmin.accessToken)
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('Kann liste einsehen', async ({ page, accountAdmin }) => {
    await page.getByTestId('sidebaritem-Accounts').click()
    await expect(
      page.getByText('Hier findest Du alle Personen die sich zu Veranstaltungen angemeldet haben.')
    ).toBeVisible()
    await expect(
      page
        .getByTestId('DataGridVirtualList')
        .first()
        .getByText(`${accountAdmin.account.person.firstname} ${accountAdmin.account.person.lastname}`)
    ).toBeVisible()
  })
  test('Kann erstellen', async ({ page }) => {
    const person = {
      firstname: 'Test',
      lastname: 'create',
      gender: 'UNSPECIFIED',
      email: 'log+person-test-create@codeanker.de',
      password: 'foo',
      role: 'USER',
    }

    await page.goto('/verwaltung/accounts/create')
    await page.waitForLoadState('networkidle')
    await page.getByTestId('BasicInput-Vorname').fill(person.firstname)
    await page.getByTestId('BasicInput-Nachname').fill(person.lastname)

    await page.getByTestId('BasicSelect-Geschlecht').click()
    await page.getByTestId(`BasicSelect-Geschlecht-${person.gender}`).click()

    // Fill Geburtsdatum // TODO: improve datepicker with testid
    await page.getByRole('textbox', { name: 'Geburtsdatum auswählen' }).click()
    await page.getByRole('button', { name: 'Open years overlay' }).click()
    await page.locator('[data-test="2002"]').click()
    await page.getByRole('button', { name: 'Open months overlay' }).click()
    await page.locator('[data-test="Sep"]').click()
    await page.locator('[data-test="Mon Sep 09 2002 00:00:00 GMT+0200 (Mitteleuropäische Sommerzeit)"]').click()

    await page.getByTestId('BasicInput-accountEmail').fill(person.email)
    await page.getByTestId('BasicPassword-accountPassword').fill(person.password)

    await page.getByTestId('BasicSelect-accountRole').click()
    await page.getByTestId(`BasicSelect-accountRole-${person.role}`).click()

    await page.getByTestId('BasicDropdown-accountStatus').click()
    await page.getByTestId('BasicDropdown-accountStatus-AKTIV').click()

    await page.getByTestId('FormAccountGeneral-submit').click()
    await page.waitForLoadState('networkidle')

    expect(page.url()).not.toContain('/create')

    const doesExsits = !!(await getAccountByName(person))
    expect(doesExsits).toBeTruthy()
  })
  mergeTests(fixtureAccountAdmin, fixtureAccountGliederungAdmin)(
    'Kann details einsehen',
    async ({ page, accountGliederungAdmin }) => {
      await page.goto(`/verwaltung/accounts/${accountGliederungAdmin.account.id}/detail`)
      await page.waitForLoadState('networkidle')

      await page.getByTestId('FormAccountGeneral-title').isVisible()

      expect(await page.getByTestId('FormAccountGeneral-title').first().textContent()).toContain(
        `${accountGliederungAdmin.account.person.firstname} ${accountGliederungAdmin.account.person.lastname}`
      )

      expect(page.getByTestId('BasicInput-accountEmail')).toHaveValue(accountGliederungAdmin.account.email)
      expect(page.getByTestId('BasicSelect-accountRole')).toContainText('Gliederung Admin')
      expect(page.getByTestId('BasicDropdown-accountStatus')).toContainText('Aktiv')
    }
  )
  mergeTests(fixtureAccountAdmin, fixtureAccountGliederungAdmin)(
    'Kann Allgemein bearbeiten',
    async ({ page, accountGliederungAdmin }) => {
      const newEmail = `log+${faker.string.nanoid(10)}@codeanker.de`

      await page.goto(`/verwaltung/accounts/${accountGliederungAdmin.account.id}/detail`)
      await page.waitForLoadState('networkidle')

      await page.getByTestId('BasicInput-accountEmail').fill(newEmail)
      await page.getByTestId('BasicSelect-accountRole').click()
      await page.getByText('Benutzer').click()

      await page.getByTestId('BasicDropdown-accountStatus').click()
      await page.getByTestId('BasicDropdown-accountStatus-DEAKTIVIERT').click()

      await page.getByTestId('FormAccountGeneral-submit').click()
      await page.waitForLoadState('networkidle')
      await new Promise((resolve) => setTimeout(resolve, 500))

      const account = await getAccountById(accountGliederungAdmin.account)
      expect(account?.email).toBe(newEmail)
      expect(account?.status).toBe('DEAKTIVIERT')
      expect(account?.role).toBe('USER')
    }
  )

  mergeTests(fixtureAccountAdmin, fixtureAccountGliederungAdmin)(
    'Kann Sicherheit bearbeiten',
    async ({ page, accountGliederungAdmin }) => {
      const oldPasswordHash = accountGliederungAdmin.account.password
      const newPassword = '8FxPoMSdJh@WM!'

      await page.goto(`/verwaltung/accounts/${accountGliederungAdmin.account.id}/detail`)
      await page.waitForLoadState('networkidle')

      await page.getByRole('tab', { name: 'Sicherheit' }).click()

      await page.getByTestId('BasicPassword-Neues Passwort').fill(newPassword)
      await page.getByTestId('BasicPassword-Passwort bestätigen').fill(newPassword)

      await page.getByRole('button', { name: 'Passwort ändern' }).click()

      await page.waitForLoadState('networkidle')
      await new Promise((resolve) => setTimeout(resolve, 500))

      const account = await getAccountById(accountGliederungAdmin.account)
      expect(account?.password).not.toBe(oldPasswordHash)
    }
  )

  mergeTests(fixtureAccountAdmin, fixtureAccountGliederungAdmin)(
    'Kann löschen',
    async ({ page, accountGliederungAdmin }) => {
      await page.goto(`/verwaltung/accounts/${accountGliederungAdmin.account.id}/detail`)
      await page.waitForLoadState('networkidle')

      await page.getByRole('tab', { name: 'Account löschen' }).click()
      await page.getByRole('textbox', { name: 'Account löschen' }).fill('Account löschen')
      await page.getByRole('button', { name: 'Löschen' }).click()

      await page.waitForLoadState('networkidle')
      await new Promise((resolve) => setTimeout(resolve, 500))

      const account = await getAccountById(accountGliederungAdmin.account)
      expect(account).toBeFalsy()
    }
  )
})
