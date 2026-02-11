# E2E Tests

This directory contains end-to-end tests for the brahmsee.digital frontend application.

## Quick Start

### Prerequisites

1. Install Playwright browsers (one-time setup):
   ```bash
   pnpm exec playwright install
   pnpm exec playwright install-deps
   ```

2. Start required services:
   ```bash
   # From repository root
   pnpm run start:services  # Database and other services
   pnpm run start:api       # API server (in another terminal)
   pnpm run start:frontend  # Frontend dev server (in another terminal)
   ```

### Running Tests

```bash
# From repository root or apps/frontend directory
NODE_ENV=test pnpm exec vitest --run -c ./apps/frontend/vitest.config.e2e.ts
```

## Test Structure

Each test file follows this pattern:

```typescript
describe('View: <view-name>', () => {
  let browser: Browser
  let context: BrowserContext
  let data: Awaited<ReturnType<typeof testUtils.createMock>>
  const runId = (Math.random() + 1).toString(36).substring(7)

  beforeAll(async () => {
    // Setup: Launch browser and create test data
    browser = await chromium.launch({ headless: true })
    context = await browser.newContext({ ignoreHTTPSErrors: true })
    data = await testUtils.createMock(runId)
  })

  afterAll(async () => {
    // Cleanup: Close browser and remove test data
    browser?.close()
    await testUtils.cleanup(runId)
  })

  it('test description', async () => {
    // Test implementation
  })
})
```

## Current Tests

### Active Tests (Not Skipped)
- `login.e2e.ts` - Login functionality
- `verwaltung-benutzer.e2e.ts` - User management view
- `verwaltung-gliederungen.e2e.ts` - Organization management

### Skipped Tests (Need Implementation)
Most tests are currently skipped with `it.skip()` and need to be implemented:
- Event dashboard, registrations, evaluations, site map, program
- Location and event administration

## Helper Functions

### insertJwtToken
Located in `helpers/insertJwtToken.ts`, this function allows tests to bypass the login flow by directly injecting a JWT token into localStorage:

```typescript
await insertJwtToken(page, data.accessToken, data.veranstaltung.id)
```

## Test Utilities

The `@codeanker/api/test` module provides:

- `createMock(runId)` - Creates test user with admin role
- `cleanup(runId)` - Removes test data from database

## Common Issues

### "Executable doesn't exist" error
Run `pnpm exec playwright install` to download browsers.

### "Can't reach database" error  
Ensure `pnpm run start:services` is running.

### Tests timing out
Increase timeout in `vitest.config.e2e.ts` or check that services are running.

## Documentation

For complete testing documentation, see `/apps/docs/src/testing.md` or run the docs:

```bash
pnpm run start:docs
```

Then visit the "Testing Guide" in the sidebar.
