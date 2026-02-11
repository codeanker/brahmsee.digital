# Testing

This document provides quick reference for running tests. For complete documentation, see `apps/docs/src/testing.md`.

## Quick Commands

### Unit Tests
```bash
# Run all unit tests
pnpm test

# Run in watch mode  
pnpm test --watch

# Run with coverage
pnpm test --coverage
```

### E2E Tests

**Prerequisites** (one-time setup):
```bash
cd apps/frontend
pnpm exec playwright install
pnpm exec playwright install-deps
```

**Running E2E tests**:
```bash
# 1. Start services (in separate terminals)
pnpm run start:services  # Docker services (database, etc.)
pnpm run start:api       # Backend API
pnpm run start:frontend  # Frontend dev server

# 2. Run tests
cd apps/frontend
NODE_ENV=test pnpm exec vitest --run -c ./vitest.config.e2e.ts
```

## Test Locations

- **Unit Tests**: `packages/*/src/*.test.ts`
- **E2E Tests**: `apps/frontend/tests/*.e2e.ts`
- **Test Utilities**: `apps/api/src/util/test.ts`

## Documentation

For detailed testing documentation including:
- How to write tests
- Test structure and patterns
- Current test coverage
- Best practices

See: `apps/docs/src/testing.md` or run `pnpm run start:docs` and visit the "Testing Guide" section.

## Test Status

✅ **Unit Tests**: Working - 1 test passing
✅ **E2E Test Infrastructure**: Fixed - tests load and run correctly
⏸️ **E2E Test Coverage**: Limited - most tests are skipped and need implementation

The E2E test infrastructure is now properly configured. Tests can run successfully but most test scenarios are marked as `it.skip()` and need to be implemented.
