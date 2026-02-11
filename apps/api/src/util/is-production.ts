/**
 * Checks if the application is running in production mode.
 * @returns True if NODE_ENV is set to 'production', false otherwise
 * @example
 * if (isProduction()) {
 *   // Use production settings
 * }
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Checks if the application is running in development mode.
 * @returns True if NODE_ENV is not set to 'production', false otherwise
 * @example
 * if (isDevelopment()) {
 *   // Enable debug logging
 * }
 */
export function isDevelopment(): boolean {
  return !isProduction()
}
