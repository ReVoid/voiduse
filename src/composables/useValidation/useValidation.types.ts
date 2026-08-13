export type Message = string;

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
  isPending: boolean;
}

export type IsAsyncValidator<V> = V extends (...args: any[]) => infer R
  ? (R extends Promise<any> ? true : false) extends true ? true : (R extends Promise<any> ? true : false) extends false ? false : true
  : false;

export type IsAsyncValidators<T extends Record<string, unknown>, V extends Validators<T>> = {
  [K in keyof V]: true extends IsAsyncValidator<V[K][number]> ? true : false
}[keyof V] extends false ? false : true;

export type ValidateReturn<IsAsync extends boolean> = IsAsync extends true
  ? Promise<boolean>
  : boolean;
