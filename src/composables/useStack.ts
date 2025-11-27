import {
  ref,
  type Ref,
  computed,
  readonly,
} from 'vue';

import {
  isEqual,
  last,
} from 'lodash-es';

export function useStack<T>(initial: T[]) {
  const stack = ref<T[]>(initial) as Ref<T[]>;

  const top = computed<T | undefined>(() => last(stack.value));

  const isEmpty = computed<boolean>(() => stack.value.length === 0);

  function push(...value: T[]): void {
    stack.value.push(...value);
  }

  function pop(): T | undefined {
    return stack.value.pop();
  }

  function isOnTop(value: T): boolean {
    return isEqual(top.value, value);
  }

  return {
    stack: readonly(stack),
    top: readonly(top),
    isEmpty,
    isOnTop,
    push,
    pop,
  }
}
