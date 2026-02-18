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
});
