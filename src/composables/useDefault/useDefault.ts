import {
  ref,
  unref,
  computed,
  type Ref,
  type MaybeRef,
} from 'vue';

import {
  isUndefined,
  isNull,
} from '@sniptt/guards';

import {
  mergeWith,
} from 'lodash-es';

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

  /**
   * Consistent value with default fallback.
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
   * ```
   */
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
   * <script setup lang="ts">
   *   const { update } = useDefault({ name: 'Unknown', salary: 0 });
   *   const payload = { name: 'John' };
   * </script>
   *
   * <template>
   *   <!-- { name: 'John', salary: 0 } -->
   *   <button @click="update(payload)">
   *     Update
   *   </button>
   * </template>
   * ```
   */
  function update(payload: MaybeRef<Partial<T>>): void {
    mergeWith(defaultValue, unref(payload), (before, after, key: keyof typeof defaultValue) => {
      if (isUndefined(after) || isNull(after)) {
        return defaultValue[key];
      }

      return after;
    });
  }

  /**
   * Resets the value to the default one.
   *
   * @example
   * ```ts
   * const { item, reset } = useDefault({ name: 'Unknown', salary: 0 });
   *
   * item.value = { name: 'John', salary: 1000 };
   *
   * reset(); // { name: 'Unknown', salary: 0 }
   * ```
   */
  function reset(): void {
    update(defaultValue);
  }

  return {
    item,
    reset,
    update,
  };
}
