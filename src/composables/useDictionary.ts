import {
  computed,
  type MaybeRef,
  readonly,
  unref,
} from 'vue';
import {
  isFunction,
  isString,
} from '@vue/shared';

type OutputFn = (...args: unknown[]) => string;

// TODO: Implement a demo
export function useDictionary<
  T extends keyof TDictionary,
  TDictionary extends Record<string | number | symbol, string | OutputFn>
>(term: MaybeRef<T>, dictionary: TDictionary) {
  const output = computed<string>(() => {
    const value = unref(term);

    const text = dictionary[value];

    if (isString(text)) {
      return text;
    }

    if (isFunction(text)) {
      return text();
    }

    return ''
  });

  return {
    output: readonly(output),
  }
}

const x = useDictionary('Success' as const, { Success: 'OK' as const })
