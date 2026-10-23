import { ref, computed, readonly, type MaybeRefOrGetter } from 'vue';

import { timeZonesNames as TIME_ZONE_NAMES } from '@vvo/tzdb';

import type {
  TimeZones,
  TimeZoneName,
} from './useTimeZone.types';

// TODO: Design and implement.
export function useTimeZone(value: MaybeRefOrGetter<TimeZoneName>) {
  const timeZone = ref<TimeZoneName>('UTC');

  const timeZones = computed<TimeZones>(() => {
    return undefined as unknown as TimeZones;
  });

  function isTimeZone(v: unknown): v is TimeZoneName {
    throw new Error('Is not implemented yet');
  }

  return {
    timeZone,
    timeZones: readonly(timeZones),
    isTimeZone,
  };
}
