export const STORAGE_ADD_CHIP_REQUEST_KEY = "addChipRequest";

/**
 * Stores the current timestamp for an add chip request
 */
export function storeAddChipRequest(): void {
  localStorage.setItem(STORAGE_ADD_CHIP_REQUEST_KEY, new Date().toISOString());
}

/**
 * Checks if there was an add chip request in the last 5 minutes
 * @returns boolean indicating if there was a recent request
 */
export function hasRecentAddChipRequest(): boolean {
  const storedTime = localStorage.getItem(STORAGE_ADD_CHIP_REQUEST_KEY);

  if (!storedTime) {
    return false;
  }

  const requestTime = new Date(storedTime);
  const currentTime = new Date();
  const fiveMinutesAgo = new Date(currentTime.getTime() - 5 * 60 * 1000);

  return requestTime > fiveMinutesAgo;
}
