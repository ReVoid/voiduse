import {
  ref,
  computed,
  readonly,
  toValue,
  type MaybeRefOrGetter,
} from 'vue';

import type {
  TimeZones,
  TimeZoneName,
  Offset,
} from './useTimeZone.types';

import {
  TIME_ZONE_NAMES,
  TIME_ZONES,
} from './useTimeZone.constants';

/**
 * Reactive time zone selection with the list of all known IANA time zones.
 *
 * @param initialValue Initial time zone, invalid values including `null` and `undefined` fall back to `UTC`.
 *
 * @example
 * ```ts
 * // Changing the time zone:
 * const { timeZone } = useTimeZone();
 *
 * timeZone.value = 'Europe/London';
 * ```
 *
 * @example
 * ```ts
 * // Type-safe assignment from an arbitrary string:
 * const { timeZone, isTimeZone } = useTimeZone();
 *
 * const rawTimeZone: string = 'America/New_York';
 *
 * timeZone.value = isTimeZone(rawTimeZone) ? rawTimeZone : 'UTC';
 * ```
 *
 * @example
 * ```ts
 * // Reading the offset:
 * const { offset } = useTimeZone('America/New_York');
 *
 * offset.value; // -300
 * ```
 */
export function useTimeZone(initialValue?: MaybeRefOrGetter<TimeZoneName | null | undefined>) {
  const initial = toValue(initialValue);

  const _timeZone = ref<TimeZoneName>(isTimeZone(initial) ? initial : 'UTC');

  /**
   * Current time zone, invalid values including `null` and `undefined` are ignored.
   *
   * @example
   * ```ts
   * const { timeZone } = useTimeZone('Europe/London');
   *
   * timeZone.value = 'Asia/Tokyo';
   * timeZone.value; // 'Asia/Tokyo'
   *
   * timeZone.value = null;
   * timeZone.value; // 'Asia/Tokyo'
   * ```
   */
  const timeZone = computed<TimeZoneName, TimeZoneName | null | undefined>({
    get() {
      return _timeZone.value;
    },
    set(v) {
      if (isTimeZone(v)) {
        _timeZone.value = v;
      }
    },
  });

  /**
   * All known IANA time zones with their standard UTC offsets (SDT, Standard Time), sorted by offset, then by name.
   *
   * @example
   * ```ts
   * const { timeZones } = useTimeZone();
   *
   * const [ tz ] = timeZones.value;
   * tz; // { name: 'Pacific/Midway', offset: -660 }
   * ```
   */
  const timeZones = computed<TimeZones>(() => {
    // Static for now, computed keeps the API compatible with dynamic data.
    return TIME_ZONES;
  });

  /**
   * Standard UTC offset (SDT, Standard Time) of the current time zone in minutes.
   *
   * @example
   * ```ts
   * const { timeZone, offset } = useTimeZone('America/New_York');
   *
   * offset.value; // -300
   *
   * timeZone.value = 'Europe/London';
   *
   * offset.value; // 0
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
   * // Basic checks:
   * isTimeZone('Europe/London'); // true
   * isTimeZone('America/Gotham_City'); // false
   *
   * // Type-safe assignment:
   * const rawTimeZone: string = 'America/Gotham_City';
   *
   * if (isTimeZone(rawTimeZone)) {
   *   timeZone.value = rawTimeZone;
   * }
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
