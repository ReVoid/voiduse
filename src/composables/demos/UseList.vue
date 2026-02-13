<script setup lang="ts">
import {
  ref,
} from 'vue';

import {
  useList,
} from '../../composables';

const {
  items,
  isEmpty,
  add,
  remove,
  replace,
  clear,
  includes,
} = useList();

const payload = ref<string>('John');

const replacement = ref<string>('Jane');
</script>

<template>
  <article>
    <h2>UseList</h2>

    <div>
      <input v-model="payload" type="text" />

      <button
        :disabled="includes(payload)"
        @click="add(payload)"
      >
        Add
      </button>

      <button @click="clear">
        Clear
      </button>
    </div>

    <div>
      <input v-model="replacement" type="text" />

      <button
        :disabled="isEmpty || (includes(replacement) || !includes(payload))"
        @click="replace(payload, replacement)"
      >
        Replace
      </button>
    </div>
    <ol>
      <li v-for="(item, i) in items" :key="i">
        <span>
          {{ item }}
        </span>
        <button @click="remove(item)">
          Remove
        </button>
      </li>
    </ol>
  </article>
</template>
