import {
  ref,
  unref,
  computed,
  type MaybeRef,
} from 'vue';

// TODO: Implement it
export function useResolver<
  const TKey extends string | number | symbol,
  const TValue,
  const TPredicate extends TKey
>(
  predicate: MaybeRef<TPredicate>,
  resolver: Record<TKey, TValue>,
) {
  return computed<TValue>(() => {
    return resolver[unref(predicate)];
  });
}

const status = ref<'Success' | 'Error' | 'Unknown'>('Unknown');

const result = useResolver(status, {
  "Success": "OK",
  "Error": "Not OK",
  "Unknown": "We don't know",
});
