import {
  describe,
  test,
  expect,
} from 'vitest';

import { useDefault } from './useDefault';

describe(useDefault.name, () => {
  test('Initialize with complex value', () => {
    const DEFAULT_VALUE = {
      name: 'Unknown',
      salary: 0,
    };

    const { item } = useDefault(DEFAULT_VALUE);

    expect(item.value).toEqual(DEFAULT_VALUE);
  });

  test('Initialize with primitive value', () => {
    const DEFAULT_VALUE: number = 0

    const { item } = useDefault(DEFAULT_VALUE);

    expect(item.value).toEqual(DEFAULT_VALUE);
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
    const DEFAULT_VALUE = {
      name: 'Unknown',
      salary: 0,
    };

    const PAYLOAD = {
      name: 'John',
      salary: 1000,
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
