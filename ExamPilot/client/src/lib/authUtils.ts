export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*authentication required|Unauthorized/.test(error.message);
}
