export type Day = {
  name: string;
  number: number;
  isDisabled: number;
  isCurrent: boolean;
};

export type Days = Day[];

export type Month = {
  name: string;
  number: number;
  isDisabled: number;
  isCurrent: boolean;
};

export type Months = Month[];

export type Year = {
  name: string;
  number: number;
  isDisabled: number;
  isCurrent: boolean;
};

export type Years = Year[];

export type DateTimeISO = string;
