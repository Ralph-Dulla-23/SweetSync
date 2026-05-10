import { format, parseISO, startOfWeek, addDays, addMinutes, startOfDay, differenceInMinutes } from 'date-fns';
import { formatInTimeZone, toDate } from 'date-fns-tz';

export const SLOTS_PER_DAY = 48;
export const SLOT_DURATION_MINUTES = 30;

/**
 * Converts a slot index (0-47) to a human-readable time string (e.g., "08:30").
 */
export const slotIndexToTime = (slotIndex: number): string => {
  const totalMinutes = slotIndex * SLOT_DURATION_MINUTES;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Returns the slot index (0-47) for a given Date object in a specific timezone.
 */
export const getSlotFromDate = (date: Date, timezone: string): number => {
  const localDate = toDate(date, { timeZone: timezone });
  const startOfLocalDay = startOfDay(localDate);
  const minutesSinceStartOfDay = differenceInMinutes(localDate, startOfLocalDay);
  return Math.floor(minutesSinceStartOfDay / SLOT_DURATION_MINUTES);
};

/**
 * Returns a Date object for a given ISO date string and slot index in a specific timezone.
 */
export const getDateFromSlot = (dateString: string, slotIndex: number, timezone: string): Date => {
  const baseDate = parseISO(dateString);
  const totalMinutes = slotIndex * SLOT_DURATION_MINUTES;
  const dateWithTime = addMinutes(startOfDay(baseDate), totalMinutes);
  return toDate(dateWithTime, { timeZone: timezone });
};

/**
 * Generates an array of 7 ISO date strings (YYYY-MM-DD) starting from the given start date.
 */
export const getWeekDays = (startDate: Date = new Date()): string[] => {
  const start = startOfWeek(startDate, { weekStartsOn: 1 }); // Monday
  return Array.from({ length: 7 }, (_, i) => format(addDays(start, i), 'yyyy-MM-dd'));
};

/**
 * Normalizes a local slot to UTC for database storage.
 * Returns { date: 'YYYY-MM-DD', slotIndex: number } in UTC.
 */
export const convertSlotToUTC = (dateString: string, slotIndex: number, timezone: string) => {
  const localDate = getDateFromSlot(dateString, slotIndex, timezone);
  const utcDateString = formatInTimeZone(localDate, 'UTC', 'yyyy-MM-dd');
  const utcSlotIndex = getSlotFromDate(localDate, 'UTC');
  return { date: utcDateString, slotIndex: utcSlotIndex };
};

/**
 * Converts a UTC slot back to a local slot for UI rendering.
 */
export const convertSlotToLocal = (utcDateString: string, utcSlotIndex: number, localTimezone: string) => {
  const utcDate = getDateFromSlot(utcDateString, utcSlotIndex, 'UTC');
  const localDateString = formatInTimeZone(utcDate, localTimezone, 'yyyy-MM-dd');
  const localSlotIndex = getSlotFromDate(utcDate, localTimezone);
  return { date: localDateString, slotIndex: localSlotIndex };
};
