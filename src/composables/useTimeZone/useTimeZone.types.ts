import type { TIME_ZONE_NAMES } from './useTimeZone.constants';

/**
 * IANA time zone name.
 *
 * @see {@link https://www.iana.org/time-zones iana.org}
 *
 * @example
 * ```ts
 * 'America/New_York';
 * 'Europe/London';
 * ```
 */
export type TimeZoneName = (typeof TIME_ZONE_NAMES)[number];

/**
 * Standard offset from UTC in minutes, without daylight saving time.
 *
 * Positive to the east of UTC, which is the opposite sign of `Date#getTimezoneOffset`.
 *
 * @example
 * ```ts
 * 60; // +01:00
 * 90; // +01:30
 *
 * -60; // -01:00
 * -90; // -01:30
 *
 * // America/New_York is always -300 (-05:00), even in summer.
 * ```
 */
export type Offset = number;

export type TimeZone = {
  name: TimeZoneName;
  offset: Offset;
};

export type TimeZones = readonly TimeZone[];
