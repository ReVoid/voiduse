import {
  ref,
  unref,
  computed,
  type Ref,
  type MaybeRef,
} from 'vue';

import {
  isObject,
  isUndefined,
  isNull,
} from '@sniptt/guards';

import { merge } from 'lodash-es';

type ConsistentOutput<T> = T extends object
  ? Required<T>
  : NonNullable<T>;

/**
 * Safe value with default fallback and flexible API.
 *
 * @example
 * ```ts
 * // Putting default values
 * const { item, reset } = useDefault({ name: 'Unknown', salary: 0 });
 *
 * // Changing normally
 * item.value = { name: 'John', salary: 1000 };
 *
 * // Changing with no explicit values
 * item.value = { name: 'Jack' }; // { name: 'Jack', salary: 1000 }
 *
 * // Changing with blank values
 * item.value = { name: 'Jane', salary: undefined }; // { name: 'Jane', salary: 0 }
 *
 * // Resetting
 * reset(); // { name: 'Unknown', salary: 0 }
 * ```
 */
// TODO: Implement value argument as first argument.
export function useDefault<T>(defaultValue: MaybeRef<ConsistentOutput<T>>) {
  const _item = ref<ConsistentOutput<T>>(unref(defaultValue)) as Ref<ConsistentOutput<T>>;

  const item = computed<ConsistentOutput<T>, Partial<T>>({
    get() {
      return _item.value;
    },
    set(payload) {
      update(payload);
    },
  });

  // TODO: Check with array type
  /**
   * Helper to avoid `computed` {@link https://github.com/vuejs/language-tools/issues/5793 issue} in `template` section.
   *
   * Do not use it within the `<script>` section.
   * @example
   * ```vue
   * <template>
   *   <button @click="update(payload)">
   *     Update
   *   </button>
   * </template>
   * ```
   */
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
