/**
 * Handles errors by logging them to the console and then rethrowing.
 * This allows for centralized error management and potential integration with error tracking services.
 *
 * @param error - The error caught in catch blocks
 * @throws {Error} - Re-throws the error after logging
 */
export function handleError(error) {
    console.error(error.stack);
    throw error;
}