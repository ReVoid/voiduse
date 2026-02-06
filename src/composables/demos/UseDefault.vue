<script setup lang="ts">
import { ref } from 'vue';

import {
  useDefault,
} from '@/composables';

type Person = {
  name: string;
  age: number;
};

const person = ref<Person>({
  name: 'John',
  age: 36,
});

const {
  item,
  reset,
  update,
} = useDefault({
  name: 'Unknown',
  age: 0,
});
</script>

<template>
  <article>
    <div>
      <strong>
        Update with:
      </strong>
      <form novalidate @submit.prevent>
        <input v-model="person.name" type="text">
        <input v-model.number="person.age" type="number">
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
    <button @click="update({ name: 'Jane' })">
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
