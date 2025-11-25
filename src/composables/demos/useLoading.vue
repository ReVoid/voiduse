<script setup lang="ts">
import {
  useLoading,
} from '../useLoading';

const {
  isLoading,
  showUntil,
} = useLoading();

async function fetch(): Promise<number> {
  const PROCESS_MOCK = Promise.all([
      new Promise<number>((resolve) => setTimeout(() => resolve(1), 3000)),
      new Promise<number>((resolve) => setTimeout(() => resolve(2), 2000)),
      new Promise<number>((resolve) => setTimeout(() => resolve(3), 1000)),
  ]);

  const data: number[] = await showUntil(PROCESS_MOCK);

  return data.reduce((accum, v) => accum + v, 0);
}
</script>

<template>
  <article>
    <button @click="fetch">
      Download
    </button>
    <div v-if="isLoading">
      Loading...
    </div>
  </article>
</template>
