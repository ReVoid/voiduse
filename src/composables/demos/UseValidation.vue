<script setup lang="ts">
import { useValidation } from '@/composables';

type Form = {
  firstName: string;
  lastName: string;
  age: number;
}

const { isValid } = useValidation<Form>({
  firstName: 'John',
  lastName: 'Doe',
  age: 35,
}, {
  firstName: [(v) => v.length > 0 || 'Required!'],
  lastName: (v) => v.length > 0 || 'Required!',
  age: [],
});
</script>

<template>
  <form novalidate @submit.prevent>
    <p>
      <strong>IsValid: </strong>
      <span>
        {{ isValid }}
      </span>
    </p>
  </form>
</template>

