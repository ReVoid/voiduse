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
} from '@sniptt/guards';

type Comparator<T> = (a: T, b: T) => boolean;

// TODO: Add docs.
export function useList<T>(comparator: Comparator<T> = isEqual) {
  const items = ref<T[]>([]) as Ref<T[]>; // Inevitable casting. Do not remove.

  const first = computed<T | undefined>(() => _first(items.value));

  const last = computed<T | undefined>(() => _last(items.value));

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

  return {
    items: readonly(items),
    first: readonly(first),
    last: readonly(last),
    add,
    remove,
    replace,
    clear,
    includes,
  };
}
