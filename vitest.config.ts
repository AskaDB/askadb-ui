import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      reporter: ['text', 'lcov'],
      lines: 90,
      functions: 90,
      branches: 90,
      statements: 90,
    },
  },
})
