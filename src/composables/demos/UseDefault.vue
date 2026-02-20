<script setup lang="ts">
import {
  ref,
} from 'vue';

import {
  useDefault,
} from '../../composables';

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
  isDefault,
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
      <span>
        {{ person }}
      </span>
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

    <p>
      <strong>
        IsDefault:
      </strong>
      <span>
        {{ isDefault }}
      </span>
    </p>



    <button @click="item = person">
      Update
    </button>
    <button @click="update({ name: person.name })">
      Update partially (name)
    </button>
    <button @click="reset">
      Reset
    </button>

    <!-- An error here! See `useDefault` docs. -->
    <!--
    <button @click="item = { name: 'John Doe' }">
      Update partially issue
    </button>
    -->
  </article>
</template>
