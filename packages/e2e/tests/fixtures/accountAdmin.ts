import { test as base, expect } from '@playwright/test'
import { cleanupAccount, createMockAccountAdmin } from '@codeanker/api/test'

type MyFixtures = {
  accountAdmin: Awaited<ReturnType<typeof createMockAccountAdmin>>
}

export const fixtureAccountAdmin = base.extend<MyFixtures>({
  accountAdmin: async ({}, use) => {
    const accountAdmin = await createMockAccountAdmin()
    await use(accountAdmin)
    await cleanupAccount(accountAdmin.account.email)
  },
})
