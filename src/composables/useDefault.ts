import {
  ref,
  unref,
  type Ref,
  type MaybeRef,
  computed,
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
  const _item = ref<Output<T>>(unref(defaultValue)) as Ref<Output<T>>;

  const item = computed<Output<T>, Partial<T>>({
    get() {
      return _item.value;
    },
    set(payload) {
      update(payload);
    },
  });

  // TODO: Check with array type
  // Function to use because of template usage issues
  function update(payload: MaybeRef<Partial<T>>): void {
    if (isObject(payload)) {
      _item.value = merge({}, unref(defaultValue), payload);
      return;
    }

    if (isUndefined(payload) || isNull(payload)) {
      _item.value = unref(defaultValue);
      return;
    }

    _item.value = payload;
  }

  function reset(): void {
    update(defaultValue);
  }

  return {
    item,
    reset,
    update,
  };
}
