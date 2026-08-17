import {
  ref,
  readonly,
  type Ref,
  computed,
  watch,
} from 'vue';

import {
  useLoading,
} from '../index.ts';

import type {
  Validators,
  Validator,
  ValidationInfo,
  IsAsyncValidators,
  ValidateReturn,
} from './useValidation.types.ts';

import {
  first,
} from 'lodash-es';

import {
  isString,
} from '@sniptt/guards';


export function useValidation<
  T extends Record<string, unknown>,
  V extends Validators<T> = Validators<T>,
>(
  schema: T,
  validators: V,
) {
  const {
    isLoading,
    showUntil,
  } = useLoading();

  type FieldName = keyof V;

  type ValidationOutput = Record<FieldName, ValidationInfo>

  const form = ref<T>(schema) as Ref<T>;

  const keys = computed<FieldName[]>(() => Object.keys(validators) as FieldName[]);

  const VALIDATION_BLANK = computed<ValidationOutput>(() => {
    return keys.value.reduce((output, name) => {
      return Object.assign(output, {
        [name]: {
          isValid: false,
          isInvalid: false,
          isPending: false,
          message: '',
        },
      });
    }, {} as ValidationOutput);
  });

  const validation = ref<ValidationOutput>(VALIDATION_BLANK.value);

  const isValid = computed<boolean>(() => {
    return keys.value.every((name) => validation.value[name].isValid);
  });

  const isInvalid = computed<boolean>(() => !isValid.value);

  // Promise<never> extends ReturnType<typeof validators[keyof typeof validators][number]> ? Promise<boolean> : boolean
  async function validateField(name: FieldName) {
    const value = form.value[name as unknown as keyof T];

    try {
      validation.value[name].isPending = true;

      const results = await showUntil((async () => {
        const output: Array<boolean | string> = [];

        for (const validator of validators[name]) {
          const res = await (validator as Validator<unknown>)(value);

          output.push(res);

          if (res !== true) {
            break;
          }
        }

        return output;
      })());

      const isValid: boolean = results.every((v) => v === true);

      const messages: string[] = results.filter(isString);

      validation.value[name] = {
        isValid,
        isInvalid: !isValid,
        isPending: false,
        message: first(messages) ?? '',
      };
    } catch {
      validation.value[name] = VALIDATION_BLANK.value;
    }
  }

  function validate(): ValidateReturn<IsAsyncValidators<T, V>> {
    const results = keys.value.map(validateField);

    const isAsync = results.some((res) => res instanceof Promise);

    if (isAsync) {
      return Promise.all(results).then(() => {}) as unknown as ValidateReturn<IsAsyncValidators<T, V>>;
    }

    return undefined as unknown as ValidateReturn<IsAsyncValidators<T, V>>;
  }

  function reset(): void {
    validation.value = VALIDATION_BLANK.value;
  }

  // TODO: Maybe I should add smart async inference
  function submit(): T {
    validate();

    return form.value;
  }

  watch(form, validate, { deep: true, immediate: true });

  return {
    form,
    isValid,
    isInvalid,
    isLoading,
    validation: readonly(validation),
    validate,
    submit,
    reset,
  }
}
