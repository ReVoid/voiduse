import {
  ref,
  type Ref,
  computed,
  readonly,
} from 'vue';

import {
  isEqual,
  last,
  first,
  remove as _remove,
} from 'lodash-es';

export function useStack<T>(initial: T[]) {
  const items = ref<T[]>(initial) as Ref<T[]>;

  const top = computed<T | undefined>(() => last(items.value));

  const bottom = computed<T | undefined>(() => first(items.value));

  const isEmpty = computed<boolean>(() => items.value.length === 0);

  const hasItems = computed<boolean>(() => !isEmpty.value);

  function push(...value: T[]): void {
    items.value.push(...value);
  }

  function pop(): T | undefined {
    return items.value.pop();
  }

  function remove(item?: T ): void {
    if (item) {
      _remove(items.value, (i) => isEqual(i, item));
    }
  }

  function isOnTop(value: T): boolean {
    return isEqual(top.value, value);
  }

  return {
    items: readonly(items),
    top: readonly(top),
    bottom: readonly(bottom),
    isEmpty,
    hasItems,
    isOnTop,
    push,
    pop,
    remove,
  }
}
