<script setup lang="ts">
import { useLocale } from '@/composables';

const { locales, locale, names } = useLocale();
</script>
<template>
  <article>
    <h2>UseLocale</h2>
    <select v-model="locale">
      <option v-for="locale in locales" :key="locale" :value="locale">
        {{ locale }}
      </option>
    </select>
    <p>
      Selected: {{ locale }}
      {{ names }}
    </p>
  </article>
</template>
