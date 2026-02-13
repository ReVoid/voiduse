<script setup lang="ts">
import { onMounted } from 'vue';

import {
  usePagination,
} from '../../composables';

const pagination = usePagination<number>((page, size) => {
  const DATA: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items: DATA.slice((page - 1) * size, page * size),
        page,
        size,
        total: DATA.length
      });
    }, 1000);
  });
});

onMounted(() => {
  pagination.first();
});
</script>

<template>
  <p>
    Items: {{ pagination.items.value }}
  </p>
  <p>
    Selected {{ pagination.page.value }}
  </p>
  <p>
    Shown {{ `${pagination.items.value.length} of ${pagination.total.value}` }}
  </p>
  <nav v-if="pagination.hasPages.value">
    <button
        :disabled="pagination.isFirst.value"
        @click="pagination.first"
    >
      First
    </button>
    <button
        :disabled="!pagination.hasPrev.value"
        @click="pagination.prev">
      Prev
    </button>
    <button
        v-for="page in pagination.count.value"
        :key="page"
        :disabled="page === pagination.page.value"
        @click="pagination.page.value = page"
    >
      {{ page }}
    </button>
    <button
        :disabled="!pagination.hasNext.value"
        @click="pagination.next"
    >
      Next
    </button>
    <button
        :disabled="pagination.isLast.value"
        @click="pagination.last"
    >
      Last
    </button>
    <button
        :disabled="!pagination.hasNext.value"
        @click="pagination.append"
    >
      Append
    </button>
    <button @click="pagination.refresh">
      Refresh
    </button>

    <select v-model="pagination.size.value">
      <option
          v-for="size in pagination.sizes.value"
          :key="size"
          :value="size"
      >
        {{ size }}
      </option>
    </select>
  </nav>
  <p v-if="pagination.isLoading.value">
    Loading...
  </p>
</template>
