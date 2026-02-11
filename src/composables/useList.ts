import {
  ref,
  computed,
  readonly,
  type Ref,
} from 'vue';

import {
  isEqual,
  first as _first,
  last as _last,
} from 'lodash-es';

import {
  isArray,
  isUndefined,
} from '@sniptt/guards';

type Comparator<T> = (a: T, b: T) => boolean;

// TODO: Add docs.
// TODO: Add null & undefined support with types to make API more flexible.
// TODO: Add shallowRef support.
export function useList<T>(comparator: Comparator<T> = isEqual) {
  const items = ref<T[]>([]) as Ref<T[]>; // Inevitable casting. Do not remove.

  const first = computed<T | undefined>(() => _first(items.value));

  const last = computed<T | undefined>(() => _last(items.value));

  const isEmpty = computed<boolean>(() => items.value.length === 0);

  function add(values: T[] | T): void {
    const payload: T[] = isArray(values)
      ? values
      : [values];

    items.value.push(...payload);
  }

  function remove(values: T[] | T): void {
    const payload: T[] = isArray(values)
      ? values
      : [values];

    items.value = items.value.filter((item) => {
      return payload.some((value) => !comparator(item, value));
    });
  }

  function replace(target: T, value: T): void {
    const index = items.value.findIndex((item) => comparator(item, target));

    if (index === -1) {
      return;
    }

    items.value.splice(index, 1, value);
  }

  function includes(value: T): boolean {
    return items.value.some((item) => comparator(item, value));
  }

  function clear(): void {
    items.value = [];
  }

  function isFirst(value: T): boolean {
    if (isUndefined(first.value)) {
      return false;
    }

    return comparator(first.value, value);
  }

  function isLast(value: T): boolean {
    if (isUndefined(last.value)) {
      return false;
    }

    return comparator(last.value, value);
  }

  // TODO: Implement flexible update
  function update(): void {
    throw new Error('useList().update() is not implemented yet.');
  }

  return {
    items: readonly(items),
    first,
    last,
    isEmpty,
    add,
    remove,
    replace,
    update,
    clear,
    includes,
    isFirst,
    isLast,
  };
}
