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
  reset,
  update,
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
    <button @click="item = person">
      Update
    </button>
    <button @click="update({ lastName: 'Doe' })">
      Update partially
    </button>
    <button @click="reset">
      Reset
    </button>

    <!-- An error here! See `useDefault` docs. -->
    <!--
    <button @click="item = { lastName: 'Doe' }">
      Update partially issue
    </button>
    -->
  </article>
</template>
