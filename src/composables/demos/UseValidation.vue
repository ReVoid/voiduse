<script setup lang="ts">
import {
  useValidation,
} from '../../composables';

const {
  form,
  isValid,
  isLoading,
  validation,
  validate,
  submit,
} = useValidation({ firstName: '', lastName: '', }, {
  firstName: [
    (value) => value.trim().length >= 1 || 'This field is required',
    (value) => value.trim().length >= 3 || `You entered ${3 - value.length} less then 3 characters`,
    (value) =>
      new Promise((resolve) =>
        setTimeout(() => {
          const isValid: boolean = value.trim().length <= 6;
          resolve(isValid ? true : `You entered ${6 - value.length} more than 6 characters`);
        }, 3000),
      ),
  ],
  lastName: [(value) => value.trim().length >= 1 || 'This field is also required'],
});

function onSubmit(): void {
  const payload = submit();

  if (payload) {
    const output = [payload.firstName, payload.lastName].join(' ');
    return console.log(`${output} has been successfully submitted`);
  }

  return console.error('Something went wrong');
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
