import { EnvironmentVariables } from '@/config/env/environment-variables'
import { vi } from 'vitest'
import { testEnvConfig } from '../_utils/env.utils'

export function setupTestEnv(overrides?: Partial<EnvironmentVariables>) {
  Object.entries({ ...testEnvConfig, ...overrides }).forEach(([key, value]) => {
    vi.stubEnv(key, Array.isArray(value) ? value.join(',') : String(value))
  })
}
