import {
  ref,
  type Ref,
  computed,
} from 'vue';

import {
  useLoading,
} from '../composables';

import type {
  Validators,
  ValidationInfo,
} from '../composables/useValidation.types.ts';

import {
  first,
} from 'lodash-es';

import {
  isString,
} from '@sniptt/guards';


export function useValidation<T extends Record<string, unknown>>(
  schema: T,
  validators: Validators<T>,
) {
  const form = ref<T>(schema) as Ref<T>;

  type FieldName = keyof typeof validators;

  const {
    isLoading,
  } = useLoading();

  type ValidationOutput = Record<FieldName, ValidationInfo>

  // TODO: Remove type unsafe code
  const validation = computed<ValidationOutput>(() => {
    const fieldNames = Object.keys(validators) as FieldName[];

    return fieldNames.reduce<ValidationOutput>((output, name) => {
      const value = form.value[name];

      const outputs = validators[name].map((validator) => validator(value));

      const isValid: boolean = outputs.every((v) => v === true)

      const message: string = first(outputs.filter(isString)) ?? '';

      return Object.assign(output, {
        [name]: {
          isValid,
          isInvalid: !isValid,
          message,
        },
      });
    }, {} as ValidationOutput);
  });

  const isValid = computed<boolean>(() => {
    const fieldNames = Object.keys(validation.value) as FieldName[];
    return fieldNames.every((name) => validation.value[name].isValid);
  });

  const isInvalid = computed<boolean>(() => !isValid.value);

  function validate(): Promise<never> extends ReturnType<typeof validators[keyof typeof validators][number]> ? Promise<boolean> : boolean {
    throw new Error('validate is not implemented');
  }

  function reset(): void {
    throw new Error('reset is not implemented');
  }

  function submit(): T | false {
    return isValid.value
      ? form.value
      : false;
  }

  return {
    form,
    isValid,
    isInvalid,
    isLoading,
    validation,
    validate,
    submit,
    reset,
  }
}


