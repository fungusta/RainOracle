/**
 * Utility functions for time-related calculations and formatting
 */

/**
 * Generates a formatted time string from a given hour (0-23)
 * @param hour - The hour of the day (0-23)
 * @returns Formatted time string (e.g., "3:00 PM")
 */
export function getTimeString(hour: number): string {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Checks if the selected time is tomorrow based on the current hour
 * @param selectedHour - The selected hour (0-23)
 * @param currentHour - The current hour (0-23)
 * @returns true if the selected time is tomorrow, false otherwise
 */
export function isTomorrow(selectedHour: number, currentHour: number): boolean {
  return selectedHour < currentHour;
}

/**
 * Calculates the number of hours from now until the selected hour
 * @param selectedHour - The selected hour (0-23)
 * @param currentHour - The current hour (0-23)
 * @returns The number of hours from now (0-23)
 */
export function getHoursFromNow(selectedHour: number, currentHour: number): number {
  let diff = selectedHour - currentHour;
  // If selected hour is earlier than current hour, it's tomorrow
  if (diff < 0) diff += 24;
  return diff;
}

/**
 * Gets the current hour of the day
 * @returns The current hour (0-23)
 */
export function getCurrentHour(): number {
  return new Date().getHours();
}

/**
 * Converts an hour (0-23) to a datetime Date object
 * If the hour is earlier than the current hour, it assumes tomorrow
 * @param hour - The hour of the day (0-23)
 * @param currentHour - The current hour (0-23), optional (defaults to current time)
 * @returns Date object representing the target datetime
 */
export function hourToDateTime(hour: number, currentHour?: number): Date {
  const now = new Date();
  const targetHour = currentHour ?? now.getHours();
  
  const datetime = new Date(now);
  datetime.setHours(hour, 0, 0, 0);
  
  // If the hour is earlier than current hour, it's tomorrow
  if (hour < targetHour) {
    datetime.setDate(datetime.getDate() + 1);
  }
  return datetime;
}

/**
 * Formats a Date object to the API-required format: YYYY-MM-DDTHH:mm:ss
 * @param date - The date to format
 * @returns Formatted date string (e.g., "2024-06-01T08:30:00")
 */
export function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

/**
 * Checks if the given hour is during daytime
 * @param hour - The hour of the day (0-23)
 * @returns true if the hour is during daytime, false otherwise
 */
export function isDaytime(hour: number): boolean {
  return hour >= 7 && hour < 19;
}

