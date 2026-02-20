import {
  describe,
  test,
  expect,
} from 'vitest';

import { useDefault } from './useDefault';

describe(useDefault.name, () => {
  test.each([
    {
      payload: 0,
      expected: 0,
    },
    {
      payload: -1,
      expected: -1,
    },
    {
      payload: 'Homer Simpson',
      expected: 'Homer Simpson',
    },
    {
      payload: [] as string[],
      expected: [] as string[],
    },
    {
      payload: { name: 'Marge Simpson', age: 34 },
      expected: { name: 'Marge Simpson', age: 34 },
    },
  ])('Initialize with value: $payload', ({ payload, expected }) => {
    type Value =
      | string
      | number
      | string[]
      | { name: string; age: number };

    const { item } = useDefault<Value>(payload);

    expect(item.value).toEqual(expected);
  });

  test.each([
    {
      initial: 0,
      payload: 1,
      expected: false,
    },
    {
      initial: 0,
      payload: 0,
      expected: true,
    },
    {
      initial: 'Unknown',
      payload: 'Homer Simpson',
      expected: false,
    },
    {
      initial: 'Unknown',
      payload: 'Unknown',
      expected: true,
    },
    {
      initial: [] as string[],
      payload: ['Something new'],
      expected: false,
    },
    {
      initial: [] as string[],
      payload: [] as string[],
      expected: true,
    },
    {
      initial: { name: 'Unknown', age: -1 },
      payload: { name: 'Lisa Simpson', age: 8 },
      expected: false,
    },
    {
      initial: { name: 'Unknown', age: -1 },
      payload: { name: 'Lisa Simpson', age: 8 },
      expected: false,
    },
  ])('Check if current value equals to default value: $initial = $payload', ({ initial, payload, expected }) => {
    type Value =
      | string
      | number
      | string[]
      | { name: string; age: number };

    const { item, isDefault } = useDefault<Value>(initial);

    item.value = payload;

    expect(isDefault.value).toBe(expected);
  });

  test('Update with complex payload', () => {
    const DEFAULT_VALUE = {
      name: 'Unknown',
      salary: 0,
    };

    const { item } = useDefault(DEFAULT_VALUE);

    const PAYLOAD = {
      name: "Homer Simpson",
      salary: 5000,
    };

    item.value = PAYLOAD;

    expect(item.value).toEqual(PAYLOAD);
  });

  test('Update with primitive payload', () => {
    const DEFAULT_VALUE: number = 0;

    const { item } = useDefault(DEFAULT_VALUE);

    const PAYLOAD = 5000;

    item.value = PAYLOAD;

    expect(item.value).toEqual(PAYLOAD);
  });

  test('Update with partial payload', () => {
    const DEFAULT_VALUE = {
      name: 'Unknown',
      salary: 0,
    };

    const { item } = useDefault(DEFAULT_VALUE);

    item.value = { name: 'Homer Simpson' };

    expect(item.value).toEqual({ name: 'Homer Simpson', salary: 0 });

    item.value = { salary: 5000 };

    expect(item.value).toEqual({ name: 'Homer Simpson', salary: 5000 });
  });

  test.each([
    {
      payload: { name: 'Homer Simpson', salary: undefined },
      expected: { name: 'Homer Simpson', salary: 0 },
    },
    {
      payload: { name: 'Homer Simpson', salary: null },
      expected: { name: 'Homer Simpson', salary: 0 },
    },
  ])('Update with partial payload containing blank value: $payload.salary', ({ payload, expected }) => {
    const DEFAULT_VALUE = {
      name: 'Unknown',
      salary: 0,
    };

    const { item } = useDefault(DEFAULT_VALUE);

    // @ts-expect-error - TODO: extends types
    item.value = payload;

    expect(item.value).toEqual(expected);
  });

  test('Update with nested complex payload', () => {
    type Node = {
      name: string;
      children?: Node[] | null | undefined;
    };

    const DEFAULT_VALUE: Required<Node> = {
      name: 'Unknown',
      children: [],
    };

    const { item } = useDefault(DEFAULT_VALUE);

    item.value = {
      name: "Homer Simpson",
      children: [
        { name: "Bart Simpson" },
        { name: "Lisa Simpson" },
      ],
    };

    const EXPECTED: Node = {
      name: 'Homer Simpson',
      children: [
        { name: 'Bart Simpson' },
        { name: 'Lisa Simpson' },
      ],
    };

    expect(item.value).toEqual(EXPECTED);
  });

  test('Reset to default value', () => {
    type Person = {
      name: string;
      age: number;
      pets: string[];
    }

    const DEFAULT_VALUE: Person = {
      name: 'Unknown',
      age: 0,
      pets: [],
    };

    const PAYLOAD: Person = {
      name: 'John',
      age: 35,
      pets: ['Dog', 'Cat'],
    };

    const {
      item,
      reset,
    } = useDefault(DEFAULT_VALUE);

    item.value = PAYLOAD;

    expect(item.value).toEqual(PAYLOAD);

    reset();

    expect(item.value).toEqual(DEFAULT_VALUE);
  });

  test('Reset to default array value', () => {
    const DEFAULT_VALUE = ['The'];

    const PAYLOAD = ['Simpsons'];

    const { item, reset } = useDefault(DEFAULT_VALUE);

    item.value = PAYLOAD;

    expect(item.value).toEqual(PAYLOAD);

    reset();

    expect(item.value).toEqual(DEFAULT_VALUE);
  });
});
