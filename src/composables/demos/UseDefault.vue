<script setup lang="ts">
import { ref } from 'vue';

import {
  useDefault,
} from '@/composables';

type Person = {
  firstName: string;
  lastName: string;
};

const person = ref<Person>({
  firstName: 'John',
  lastName: 'Doe',
});

const {
  item,
  update,
  reset,
} = useDefault({
  firstName: 'Unknown',
  lastName: 'Unknown',
});
</script>

<template>
  <article>
    <div>
      <strong>
        Update with:
      </strong>
      <form novalidate @submit.prevent>
        <input v-model="person.firstName">
        <input v-model="person.lastName">
      </form>
    </div>
    <p>
      <strong>
        Item:
      </strong>
      <span>
        {{ item }}
      </span>
    </p>
    <button @click="update(person)">
      Update
    </button>
    <button @click="reset">
      Reset
    </button>
  </article>
</template>
