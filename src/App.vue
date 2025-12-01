<script setup lang="ts">
import {
  UseLoading,
  UseStack,
  UsePagination,
  UseDefault,
  UseValidation,
} from '@/composables/demos';
</script>

<template>
  <article>
    <h2>useLoading.ts</h2>
    <UseLoading />
  </article>

  <article>
    <h2>useStack.ts</h2>
    <UseStack />
  </article>

  <article>
    <h2>usePagination.ts</h2>
    <UsePagination />
  </article>

  <article>
    <h2>useDefault.ts</h2>
    <UseDefault />
  </article>

  <article>
    <h2>useValidation.ts</h2>
    <UseValidation />
  </article>
</template>
