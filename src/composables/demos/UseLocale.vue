<script setup lang="ts">
import {
  useLocale,
} from '../../composables';

const {
  locale,
  locales,
  language,
  languages,
  isAvailable,
} = useLocale();
</script>
<template>
  <article>
    <h2>useLocale</h2>
    <select v-model="locale">
      <option
        v-for="locale in locales"
        :key="locale"
        :value="locale"
      >
        {{ locale }}
      </option>
    </select>
    <select v-model="language">
      <option
        v-for="language in languages"
        :key="language"
        :value="language"
      >
        {{ language }}
      </option>
    </select>
    <p>
      Selected locale: {{ locale }}
    </p>
    <p>
      Selected language: {{ language }}
    </p>
    <p>
      Is available: {{ isAvailable(locale) }}
    </p>
  </article>
</template>
