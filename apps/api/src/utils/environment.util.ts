import * as dotenv from 'dotenv'

dotenv.config()

/**
 * Extract specific environment variables from the current process.
 * @param keys The list of environment variable keys to extract.
 * @returns A filtered object containing only the specified environment variables.
 */
function getEnvVars<T extends keyof NodeJS.ProcessEnv>(
  ...keys: T[]
): Record<T, string> {
  return keys.reduce((accumulatedEnv, currentKey) => {
    if (process.env[currentKey]) {
      accumulatedEnv[currentKey] = process.env[currentKey] as string
    }
    return accumulatedEnv
  }, {} as Record<T, string>)
}

export { getEnvVars }
