<script setup lang="ts">
import {
  ref,
  watch,
  onMounted,
} from 'vue';

import { usePagination } from '../../composables';

const {
  items,
  page,
  size,
  sizes,
  total,
  count,
  hasPages,
  hasPrev,
  hasNext,
  isFirst,
  isLast,
  isLoading,
  prev,
  next,
  first,
  last,
  append,
  refresh,
} = usePagination<number>((page, size) => {
  // Backend-like dummy.
  return new Promise((resolve) => {
    const DATA: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].filter((v) => v <= filter.value);

    setTimeout(() => {
      resolve({
        items: DATA.slice((page - 1) * size, page * size),
        page,
        size,
        total: DATA.length,
      });
    }, 1000);
  });
});

const filter = ref<number>(11);

watch(filter, () => {
  first();
});

onMounted(() => {
  first();
});
</script>

<template>
  <p>
    Items: {{ items }}
  </p>

  <p>
    Shown {{ `${items.length} of ${total}` }}
  </p>

  <label>
    Max number
    <input
      v-model.number="filter"
      type="number"
    />
  </label>

  <nav v-if="hasPages">
    <button
      :disabled="isFirst"
      @click="first"
    >
      First
    </button>

    <button
      :disabled="!hasPrev"
      @click="prev"
    >
      Prev
    </button>

    <button
      v-for="pageNumber in count"
      :key="pageNumber"
      :disabled="pageNumber === page"
      @click="page = pageNumber"
    >
      {{ pageNumber }}
    </button>

    <button
      :disabled="!hasNext"
      @click="next">
      Next
    </button>

    <button
      :disabled="isLast"
      @click="last">
      Last
    </button>

    <button
      :disabled="!hasNext"
      @click="append"
    >
      Append
    </button>

    <button @click="refresh">
      Refresh
    </button>

    <select v-model="size">
      <option
        v-for="size in sizes"
        :key="size"
        :value="size"
      >
        {{ size }}
      </option>
    </select>
  </nav>

  <p v-if="isLoading">
    Loading...
  </p>
</template>
