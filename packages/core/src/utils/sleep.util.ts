/**
 * Creates a promise that resolves after a specified duration, effectively
 * pausing execution in an async function for the given time.
 *
 * @param duration - The time to sleep in milliseconds. If the value is negative or zero, the promise will resolve immediately.
 *
 * @returns A Promise that resolves after the specified duration.
 */
export async function sleep(duration: number): Promise<void> {
  // Handle negative or zero duration
  if (duration <= 0) {
    return;
  }

  return new Promise<void>((resolve) => setTimeout(resolve, duration));
}

/**
 * Creates a promise that resolves at a specific date/time.
 *
 * @param date - The target date/time when the promise should resolve. If the date is in the past, the promise resolves immediately.
 *
 * @returns A Promise that resolves at the specified date/time.
 */
export function sleepUntil(date: Date): Promise<void> {
  const now = Date.now();
  const target = date.getTime();
  const duration = target - now;

  return sleep(duration);
}
