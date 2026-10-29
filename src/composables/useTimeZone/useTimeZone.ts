import { ref, computed, readonly, toValue, type MaybeRefOrGetter } from 'vue';

import type { TimeZones, TimeZoneName, Offset } from './useTimeZone.types';

import { TIME_ZONE_NAMES, TIME_ZONES } from './useTimeZone.constants';

/**
 * Time zones for a time zone picker.
 *
 * @param initialValue Initial time zone. Read only once, later changes of a ref or getter are not tracked.
 *
 * @example
 * ```ts
 * const { timeZone, timeZones, offset } = useTimeZone('Europe/London');
 *
 * timeZone.value; // "Europe/London"
 * offset.value; // 0
 * timeZones.value[0]; // { name: "Pacific/Midway", offset: -660 }
 * ```
 */
export function useTimeZone(initialValue: MaybeRefOrGetter<TimeZoneName> = 'UTC') {
  const timeZone = ref<TimeZoneName>(toValue(initialValue));

  // Static for now, computed keeps the API compatible with dynamic data.
  const timeZones = computed<TimeZones>(() => {
    return TIME_ZONES;
  });

  /**
   * Standard offset of the current time zone.
   *
   * @example
   * ```ts
   * const { timeZone, offset } = useTimeZone('Asia/Kolkata');
   *
   * offset.value; // 330
   *
   * timeZone.value = 'America/New_York';
   *
   * offset.value; // -300
   * ```
   */
  const offset = computed<Offset>(() => {
    // TimeZoneName guarantees the time zone is in the list.
    return timeZones.value.find(({ name }) => name === timeZone.value)!.offset;
  });

  /**
   * Checks whether a given value is a known time zone name.
   *
   * @example
   * ```ts
   * const { timeZone, isTimeZone } = useTimeZone();
   *
   * const value: string = localStorage.getItem('timeZone') ?? '';
   *
   * // Narrows string to TimeZoneName, so it can be assigned strictly.
   * if (isTimeZone(value)) {
   *   timeZone.value = value;
   * }
   *
   * isTimeZone('Europe/London'); // true
   * isTimeZone('Mars/Olympus'); // false
   * isTimeZone(null); // false
   * ```
   */
  function isTimeZone(v: unknown): v is TimeZoneName {
    return (TIME_ZONE_NAMES as readonly unknown[]).includes(v);
  }

  return {
    timeZone,
    timeZones: readonly(timeZones),
    offset,
    isTimeZone,
  };
}
