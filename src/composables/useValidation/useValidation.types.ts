
export type Message =
  | string
  | { success?: string; error?: string; pending?: string }

 export type Validator<T> = (
   value: T,
 ) => boolean | Message | Promise<boolean | Message>;

export type ValidatorGroup<T> = Validator<T>[];

export type Validators<T extends Record<string, unknown>> = {
  [K in keyof T]: ValidatorGroup<T[K]>;
}

export type ValidationInfo = {
  message: string;
  isValid: boolean;
  isInvalid: boolean;
}

export type Mode = 'Lazy' | 'Instant';
