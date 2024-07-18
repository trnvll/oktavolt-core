import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * Helper function to load a prompt file
 * @param filename The name of the prompt file (e.g., 'users.txt')
 * @param callerFilePath The __filename of the calling module
 * @returns The content of the prompt file as a string
 */
export function loadPromptFile(
  filename: string,
  callerFilePath: string,
): string {
  const filePath = join(callerFilePath, filename)

  try {
    return readFileSync(filePath, 'utf-8')
  } catch (error) {
    console.error(`Error loading prompt file ${filename}:`, error)
    throw new Error(`Failed to load prompt file: ${filename}`)
  }
}
