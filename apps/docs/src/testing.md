# Testing Guide

This document explains how to run and write tests for brahmsee.digital.

## Overview

The project uses two types of tests:

1. **Unit Tests** - Fast, isolated tests for individual functions and utilities
2. **End-to-End (E2E) Tests** - Integration tests that test the entire application flow using a real browser

## Test Framework

- **Vitest** - Modern test runner (compatible with Vite)
- **Playwright** - Browser automation for E2E tests
- **Testing Philosophy** - We use Vitest with Playwright for E2E tests instead of native Playwright Test to keep test infrastructure unified

## Running Tests

### Unit Tests

Unit tests are fast and can run without any external dependencies:

```bash
# Run all unit tests
pnpm test

# Run unit tests in watch mode
pnpm test --watch

# Run unit tests with coverage
pnpm test --coverage
```

### E2E Tests

E2E tests require additional infrastructure to run:

#### Prerequisites

1. **Install Playwright browsers** (one-time setup):
   ```bash
   cd apps/frontend
   pnpm exec playwright install
   pnpm exec playwright install-deps
   ```

2. **Start required services**:
   ```bash
   # Start database and other services
   pnpm run start:services
   
   # In another terminal, start the API
   pnpm run start:api
   
   # In another terminal, start the frontend
   pnpm run start:frontend
   ```

3. **Run E2E tests**:
   ```bash
   cd apps/frontend
   NODE_ENV=test pnpm exec vitest --run -c ./vitest.config.e2e.ts
   ```

## Writing Tests

### Unit Tests

Unit tests should be placed alongside the code they test with a `.test.ts` extension.

**Example**: `packages/helpers/src/group-by.test.ts`

```typescript
import { expect, test } from 'vitest'
import { groupBy } from './group-by.js'

test('groupBy', () => {
  const data = [
    { id: 1, category: 'A' },
    { id: 2, category: 'B' },
  ]

  const result = groupBy(data, (item) => item.category)

  expect(result).toEqual({
    A: [{ id: 1, category: 'A' }],
    B: [{ id: 2, category: 'B' }],
  })
})
```

### E2E Tests

E2E tests are located in `apps/frontend/tests/` and have a `.e2e.ts` extension.

**Structure of an E2E test:**

```typescript
import dayjs from 'dayjs'
import { type Browser, chromium, type BrowserContext } from 'playwright'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import * as testUtils from '@codeanker/api/test'

describe('Feature: Login', () => {
  let browser: Browser
  let context: BrowserContext
  let data: Awaited<ReturnType<typeof testUtils.createMock>>
  const runId = (Math.random() + 1).toString(36).substring(7)

  beforeAll(async () => {
    // Launch browser
    browser = await chromium.launch({ headless: true })
    context = await browser.newContext({ ignoreHTTPSErrors: true })
    
    // Create test data in database
    data = await testUtils.createMock(runId)
  })

  afterAll(async () => {
    // Clean up browser
    browser?.close()
    
    // Clean up test data from database
    await testUtils.cleanup(runId)
  })

  it('User can login', async () => {
    const page = await context.newPage()
    await page.goto('https://localhost:8080/login')
    await page.getByPlaceholder('E-Mail').fill(data.account.email)
    await page.getByPlaceholder('Passwort').fill(data.accountPassword)
    await page.getByPlaceholder('Passwort').press('Enter')
    
    // Wait for navigation away from login page
    await expect(page).not.toHaveURL(/login/)
  })
})
```

### Helper Functions

#### insertJwtToken

For tests that don't need to test the login flow, you can directly insert a JWT token:

```typescript
import { insertJwtToken } from './helpers/insertJwtToken'

it('Can access protected page', async () => {
  const page = await context.newPage()
  
  // Insert JWT token and last event ID into localStorage
  await insertJwtToken(page, data.accessToken, data.veranstaltung.id)
  
  // Navigate to protected page
  await page.goto('https://localhost:8080/verwaltung/accounts')
  await page.waitForLoadState('networkidle')
  
  // Assert page loaded successfully
  await expect(page).toHaveURL(/verwaltung/)
})
```

## Current Test Coverage

### Unit Tests
- ✅ `packages/helpers/src/group-by.test.ts` - Tests the groupBy utility function

### E2E Tests

#### Login & Authentication
- ✅ `tests/login.e2e.ts` - User login functionality
  - ✅ Standard user can login
  - ⏸️ Password reset (skipped - not implemented yet)

#### Event Management (Veranstaltung)
- ⏸️ `tests/veranstaltung-dashboard.e2e.ts` - Event dashboard view
- ⏸️ `tests/veranstaltung-anmeldungen.e2e.ts` - Event registrations
- ⏸️ `tests/veranstaltung-auswertung.e2e.ts` - Event evaluations
- ⏸️ `tests/veranstaltung-lageplan.e2e.ts` - Event site map
- ⏸️ `tests/veranstaltung-programm.e2e.ts` - Event program

#### Administration (Verwaltung)
- ✅ `tests/verwaltung-benutzer.e2e.ts` - User management
  - ✅ View is accessible
- ✅ `tests/verwaltung-gliederungen.e2e.ts` - Organization management
  - ✅ List organizations
  - ⏸️ Create organization (skipped)
  - ⏸️ View organization details (skipped)
- ⏸️ `tests/verwaltung-orte.e2e.ts` - Location management
- ⏸️ `tests/verwaltung-veranstaltungen.e2e.ts` - Event administration

Legend:
- ✅ = Test implemented and active
- ⏸️ = Test exists but is skipped (needs implementation)

## Test Infrastructure

### Why Vitest + Playwright?

Originally, we used Vitest with Playwright to unify unit tests and E2E tests under one test runner. While native Playwright Test is more common for E2E testing, we continue to use this approach because:

1. **Unified Configuration** - Single test configuration for both unit and E2E tests
2. **Consistent Developer Experience** - Same commands and patterns for all tests
3. **Vite Integration** - Seamless integration with our Vite-based frontend build

### Test Configuration Files

- `vitest.config.ts` - Root configuration for unit tests
- `vitest.workspace.ts` - Workspace configuration (currently only using root config)
- `apps/frontend/vitest.config.e2e.ts` - Configuration for E2E tests
- `apps/api/config/test.json` - API configuration for test environment

### Test Utilities

Located in `apps/api/src/util/test.ts`:

- `createMock(runId)` - Creates a test user account and returns credentials
- `cleanup(runId)` - Removes test data created by createMock

## Common Issues

### Playwright browsers not installed

```
Error: browserType.launch: Executable doesn't exist
```

**Solution**: Install Playwright browsers:
```bash
cd apps/frontend
pnpm exec playwright install
```

### Database not accessible

```
PrismaClientInitializationError: Can't reach database server
```

**Solution**: Start the database service:
```bash
pnpm run start:services
```

### Configuration errors in tests

```
ZodError: Required field missing
```

**Solution**: Ensure `apps/api/config/test.json` exists with required configuration values

## Test Scenarios to Implement

The following test scenarios have been identified but not yet implemented:

### High Priority
1. **Event Registration Flow** - Users registering for events
2. **Event Creation** - Administrators creating new events
3. **User Management** - Creating and editing user accounts
4. **Organization Management** - CRUD operations for organizations

### Medium Priority
5. **Location Management** - Adding and editing event locations
6. **Event Program** - Managing event schedules
7. **Site Map** - Event location maps
8. **Event Evaluation** - Post-event analytics and reports

### Low Priority
9. **Password Reset Flow** - Complete password reset functionality
10. **Bulk Operations** - Mass updates and exports

## Best Practices

1. **Use unique test data** - Generate random IDs (`runId`) to avoid conflicts
2. **Clean up after tests** - Always remove test data in `afterAll`
3. **Test user journeys** - E2E tests should simulate real user workflows
4. **Keep tests independent** - Tests should not depend on each other
5. **Use meaningful descriptions** - Write test names in German to match the UI
6. **Skip incomplete tests** - Use `it.skip` for tests that are not yet implemented

## Contributing

When adding new features, please:

1. Add unit tests for new utility functions
2. Add E2E tests for new user-facing features
3. Update this documentation with new test scenarios
4. Ensure all tests pass before submitting a PR

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
