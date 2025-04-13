import { test as base, expect } from '@playwright/test'
import { cleanupAccount, createMockAccountGliederungAdmin } from '@codeanker/api/test'

type MyFixtures = {
  accountGliederungAdmin: Awaited<ReturnType<typeof createMockAccountGliederungAdmin>>
}

export const fixtureAccountGliederungAdmin = base.extend<MyFixtures>({
  accountGliederungAdmin: async ({}, use) => {
    const accountGliederungAdmin = await createMockAccountGliederungAdmin()
    await use(accountGliederungAdmin)
    await cleanupAccount(accountGliederungAdmin.account.id)
  },
})
