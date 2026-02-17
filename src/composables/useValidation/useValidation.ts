import {
  ref,
  type Ref,
  computed,
} from 'vue';

import {
  useLoading,
} from '../index.ts';

import type {
  Validators,
  ValidationInfo,
} from './useValidation.types.ts';

import {
  first,
} from 'lodash-es';

import {
  isString,
  isBoolean,
} from '@sniptt/guards';


export function useValidation<T extends Record<string, unknown>>(
  schema: T,
  validators: Validators<T>,
) {
  const {
    isLoading,
  } = useLoading();

  type FieldName = keyof typeof validators;

  type ValidationOutput = Record<FieldName, ValidationInfo>

  const form = ref<T>(schema) as Ref<T>;

  const keys = computed<FieldName[]>(() => Object.keys(validators) as FieldName[]);

  const validation = computed<ValidationOutput>(() => {
    return keys.value.reduce<ValidationOutput>((output, name) => {
      const value = form.value[name];

      const outputs = validators[name].map((validator) => validator(value));

      const isValid: boolean = outputs.every((v) => {
        if (isBoolean(v)) {
          return v;
        }

        if (isString(v)) {
          return false;
        }

        // TODO: Implement promise resolving
      });

      const message: string = first(outputs.filter(isString)) ?? '';

      return Object.assign(output, {
        [name]: {
          isValid,
          isInvalid: !isValid,
          isPending: false, // TODO: Implement it
          message,
        },
      });
    }, {} as ValidationOutput);
  });

  const isValid = computed<boolean>(() => {
    return keys.value.every((name) => validation.value[name].isValid);
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


