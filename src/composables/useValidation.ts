import {
  ref,
  type MaybeRef,
  computed,
  readonly,
  unref,
} from 'vue';

import type {
  Validators,
  ValidationInfo,
} from '../composables/useValidation.types.ts';

import { isString } from '@sniptt/guards';
import { first } from 'lodash-es';


export function useValidation<
  T extends object,
  TValidators extends Validators<T>
>(
  form: MaybeRef<T>,
  validators: TValidators,
) {
  type FieldName = keyof TValidators & keyof T & string;

  const isLoading = ref<boolean>(false);

  type ValidationOutput = Record<FieldName, ValidationInfo>

  // TODO: Remove type unsafe code
  const validation = computed<ValidationOutput>(() => {
    const fieldNames = Object.keys(validators) as FieldName[];

    return fieldNames.reduce<ValidationOutput>((output, name) => {
      const value = unref(form)[name];

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
      ? unref(form)
      : false;
  }

  return {
    isValid,
    isInvalid,
    isLoading: readonly(isLoading),
    validation,
    validate,
    submit,
    reset,
  }
}


