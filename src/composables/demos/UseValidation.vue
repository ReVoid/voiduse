<script setup lang="ts">
import {
  ref,
} from 'vue';

import {
  useValidation,
} from '../../composables';

type Form = {
  firstName: string;
  lastName: string;
}

const form = ref<Form>({
  firstName: '',
  lastName: '',
});

const {
  isValid,
  isLoading,
  validation,
  validate,
  submit,
} = useValidation(form, {
  firstName: [
    (value) => value.trim().length >= 1 || 'This field is required',
    (value) => value.trim().length >= 3 || `You entered ${value.length} less then 3 characters`,
    (value) => value.trim().length <= 6 || `You entered ${value.length} more than 6 characters`
  ],
  lastName: [(value) => value.trim().length >= 1 || 'This field is also required'],
});

function onSubmit(): void {
  const payload = submit();

  if (payload) {
    const output = [payload.firstName, payload.lastName].join(' ');
    return console.log(`${output} has been successfully submitted`);
  }

  return console.log('Something went wrong');
}
</script>

<template>
  <form novalidate @submit.prevent>
    <h3>
      Form isValid: {{ isValid }}
    </h3>
    <p v-if="isLoading">
      ...validating
    </p>
    <div>
      <label>
        <span>Firstname</span>
        <input v-model="form.firstName" />
      </label>
      <p>
        {{ validation.firstName.isValid }} {{ validation.firstName.message }}
      </p>
    </div>
    <div>
      <label>
        <span>Lastname</span>
        <input v-model="form.lastName" />
      </label>
      <p>
        {{ validation.lastName.isValid }} {{ validation.lastName.message }}
      </p>
    </div>
    <div>
      <button @click="validate">
        Validate
      </button>
      <button @click="onSubmit">
        Submit
      </button>
    </div>
  </form>
</template>

