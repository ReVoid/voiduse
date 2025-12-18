import {
  ref,
  readonly,
  computed,
} from 'vue';

export function useLoading() {
  const count = ref<number>(0);

  const isLoading = computed<boolean>(() => count.value > 0);

  function showUntil<T extends Promise<unknown>>(process: T): T {
      count.value++;
      process.finally(() => count.value--);
      return process;
  }

  return {
    isLoading: readonly(isLoading),
    showUntil,
  };
}
