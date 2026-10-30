import {
  describe,
  test,
  expect,
  expectTypeOf,
} from 'vitest';

import { ref } from 'vue';

import { rawTimeZones } from '@vvo/tzdb';

import { useTimeZone } from './useTimeZone';

import type { TimeZoneName } from './useTimeZone.types';

import { TIME_ZONE_NAMES, TIME_ZONES } from './useTimeZone.constants';

describe(useTimeZone.name, () => {
  test('Defaults to UTC', () => {
    const { timeZone, offset } = useTimeZone();

    expect(timeZone.value).toBe('UTC');

    expect(offset.value).toBe(0);
  });

  test.each([
    {
      payload: 'Europe/London' as const,
    },
    {
      payload: ref('Europe/London' as const),
    },
    {
      payload: () => 'Europe/London' as const,
    },
  ])('Initialize with $payload', ({ payload }) => {
    const { timeZone } = useTimeZone(payload);

    expect(timeZone.value).toBe('Europe/London');
  });

  test.each([
    {
      payload: null,
    },
    {
      payload: undefined,
    },
    {
      payload: ref(null),
    },
    {
      payload: ref(undefined),
    },
    {
      payload: () => null,
    },
    {
      payload: () => undefined,
    },
  ])('Falls back to UTC when initialized with $payload', ({ payload }) => {
    const { timeZone, offset } = useTimeZone(payload);

    expect(timeZone.value).toBe('UTC');
    expect(offset.value).toBe(0);
  });

  test('Keeps time zone non-nullable when initialized with nullable value', () => {
    const initial = ref<TimeZoneName | null | undefined>(null);

    const { timeZone } = useTimeZone(initial);

    expectTypeOf(timeZone.value).toEqualTypeOf<TimeZoneName>();
  });

  test('Falls back to UTC when initialized with unknown time zone', () => {
    // @ts-expect-error - testing
    const { timeZone } = useTimeZone('America/Gotham_City');

    expect(timeZone.value).toBe('UTC');
  });

  test('Reads initial value only once', () => {
    const initial = ref<TimeZoneName>('Europe/London');

    const { timeZone } = useTimeZone(initial);

    initial.value = 'Asia/Tokyo';

    expect(timeZone.value).toBe('Europe/London');
  });

  test('Changes time zone', () => {
    const { timeZone } = useTimeZone();

    timeZone.value = 'Asia/Tokyo';

    expect(timeZone.value).toBe('Asia/Tokyo');
  });

  test.each([
    undefined,
    null,
    '',
    'America/Gotham_City',
  ])('Ignores blank or invalid assignment: $0', (payload ) => {
    const { timeZone, offset } = useTimeZone('Asia/Kolkata');

    // @ts-expect-error - testing
    timeZone.value = payload;

    expect(timeZone.value).toBe('Asia/Kolkata');
    expect(offset.value).toBe(330);
  });

  test.each([
    {
      payload: 'UTC',
      expected: true,
    },
    {
      payload: 'Europe/Kyiv',
      expected: true,
    },
    {
      payload: 'Europe/Kiev', // Deprecated, not in the list
      expected: false,
    },
    {
      payload: 'utc',
      expected: false,
    },
    {
      payload: 'America/Gotham_City',
      expected: false,
    },
    {
      payload: '',
      expected: false,
    },
    {
      payload: null,
      expected: false,
    },
    {
      payload: 42,
      expected: false,
    },
  ])('Checks time zone: $payload', ({ payload, expected }) => {
    const { isTimeZone } = useTimeZone();

    expect(isTimeZone(payload)).toBe(expected);
  });

  test('Lists every time zone exactly once', () => {
    const { timeZones } = useTimeZone();

    const names = timeZones.value.map(({ name }) => name);

    expect(names.sort()).toEqual([...TIME_ZONE_NAMES].sort());
  });

  test('Sorts time zones by offset, then by name', () => {
    const { timeZones } = useTimeZone();

    const isSorted = timeZones.value.every((current, index, list) => {
      const previous = list[index - 1];

      if (!previous) {
        return true;
      }

      return previous.offset < current.offset || (previous.offset === current.offset && previous.name < current.name);
    });

    expect(isSorted).toBe(true);
  });

  test.each(
    TIME_ZONE_NAMES.map((name) => {
      return {
        name,
        expected: TIME_ZONES.find((timeZone) => timeZone.name === name)?.offset,
      };
    }),
  )('Has offset $expected for $name', ({ name, expected }) => {
    const { offset } = useTimeZone(name);

    expect(offset.value).toBe(expected);
  });

  // Catches constants that were not regenerated after updating @vvo/tzdb.
  test('Matches offsets of installed tzdb', () => {
    const { timeZones } = useTimeZone();

    const offsets = new Map<string, number>([
      ['UTC', 0],
      ...rawTimeZones.flatMap(({ group, rawOffsetInMinutes }) => {
        return group.map((name) => [name, rawOffsetInMinutes] as const);
      }),
    ]);

    const mismatches = timeZones.value.filter(({ name, offset }) => offsets.get(name) !== offset);

    expect(mismatches).toEqual([]);
  });

  test.each([
    {
      payload: undefined,
      expected: 0,
    },
    {
      payload: 'Asia/Kolkata' as const,
      expected: 330,
    },
  ])('Has offset $expected of initial time zone $payload', ({ payload, expected }) => {
    const { offset } = useTimeZone(payload);

    expect(offset.value).toBe(expected);
  });

  test('Updates offset when time zone changes', () => {
    const { timeZone, offset } = useTimeZone();

    timeZone.value = 'America/New_York';

    expect(offset.value).toBe(-300);
  });
});
