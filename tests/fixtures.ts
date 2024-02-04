import { exec } from 'child_process'
import { promisify } from 'util'

import { test as baseTest } from '@playwright/test'

const asyncExec = promisify(exec)

async function npx(command: string, databaseUrl: string) {
  const { stdout, stderr } = await asyncExec(`npx ${command}`, {
    cwd: 'api/',
    env: { ...process.env, DATABASE_URL: databaseUrl },
  })
  // eslint-disable-next-line no-console
  console.log(stdout)
  if (stderr) throw new Error('stderr: ' + stderr)
}

export * from '@playwright/test'
export const test = baseTest.extend<object, { user: { email: string; password: string } }>({
  // Returns db user name unique for the worker.
  user: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      await npx(
        'prisma migrate reset --force',
        'postgresql://postgres:postgres@localhost:5433/brahmsee.digital?schema=public'
      )
      await use({ email: 'admin@example.org', password: 'admin' })
    },
    { scope: 'worker' },
  ],
})
