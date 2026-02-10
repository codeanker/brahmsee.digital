// vitest.config.e2e.ts
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ['tests/**/*.e2e.ts'],
      globals: true,
      testTimeout: 60000,
      hookTimeout: 60000,
    },
  })
)
