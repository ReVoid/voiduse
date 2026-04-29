import { describe, expect, test, vitest, beforeEach, afterEach } from 'vitest';

import { useLoading } from '@/composables';

beforeEach(() => {
  vitest.useFakeTimers();
});

afterEach(() => {
  vitest.useRealTimers();
});

describe('useLoading', () => {
  test('Changing state', async () => {
    const { isLoading, showUntil } = useLoading();

    showUntil(new Promise((resolve) => setTimeout(resolve, 1000)));

    expect(isLoading.value).toBe(true);

    await vitest.advanceTimersByTimeAsync(1000);

    expect(isLoading.value).toBe(false);
  });

  test('Returns the resolved value of the promise', async () => {
    const { showUntil } = useLoading();

    const output = await showUntil(Promise.resolve('OK'));

    expect(output).toBe('OK');
  });

  test('Changing state manually is not allowed', async () => {
    const { isLoading } = useLoading();

    // @ts-expect-error: for testing purposes only.
    isLoading.value = true;

    expect(isLoading.value).toBe(false);
  });
});
