import { computed } from 'vue'

import { isArray } from '@sniptt/guards';

type Validator<T> = (value: T, message?: string) => boolean | string;

type ValidatorGroup<T> = Validator<T>[];

// TODO: Design and implement
// DRAFT!
export function useValidation<
  T extends object,
>(
  form: Partial<T>,
  validators: { [K in keyof T]: Validator<T[K]> | ValidatorGroup<T[K]> }
) {
  const isValid = computed<boolean>(() => {
    const fieldNames = Object.keys(validators) as (keyof typeof validators)[];

    return fieldNames.every((name) => {
      const fieldValidators = validators[name];

      if (isArray(fieldValidators)) {
        return fieldValidators.every(v => v(form[name]!) === true)
      } else {
        return fieldValidators(form[name]!) === true;
      }
    });
  });

  return {
    isValid,
  }
}
