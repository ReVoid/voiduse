import {
  ref,
  unref,
  type Ref,
  type MaybeRef,
  readonly,
} from 'vue';

import {
  isObject,
  isUndefined,
  isNull,
} from '@sniptt/guards';

import {
  merge,
} from 'lodash-es';

type Output<T> = T extends object
  ? Required<T>
  : T;

export function useDefault<T>(defaultValue: MaybeRef<Output<T>>) {
  const item = ref<Output<T>>(unref(defaultValue)) as Ref<Output<T>>;

  function update(payload: MaybeRef<Partial<T>>): void {
    if (isObject(payload)) {
      item.value = merge({}, unref(defaultValue), payload);
      return;
    }

    if (isUndefined(payload) || isNull(payload)) {
      item.value = unref(defaultValue);
      return;
    }
    // TODO: Check with array type

    item.value = payload;
  }

  function reset(): void {
    update(defaultValue);
  }

  return {
    item: readonly(item),
    update,
    reset,
  };
}
