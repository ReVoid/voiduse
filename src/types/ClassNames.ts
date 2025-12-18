// The same type as Vue required.
// Unfortunately, they don't share it explicitly.
export type ClassNames =
  | string
  | Record<string, boolean> | (string | Record<string, boolean>)[];
