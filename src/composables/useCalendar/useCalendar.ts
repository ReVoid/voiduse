import { computed, readonly } from 'vue';
import type { DateTimeISO, Days, Months, Years } from '@/composables/useCalendar/useCalendar.types.ts';

// TODO: Design and implement
export function useCalendar() {
  const years = computed<Years>(() => []);
  const months = computed<Months>(() => []);
  const days = computed<Days>(() => []);
  const date = computed<DateTimeISO | undefined>(() => undefined);

  const weekDays = computed<string[]>(() => []);

  return {
    date,
    years: readonly(years),
    months: readonly(months),
    days: readonly(days),
    weekDays: readonly(weekDays),
  };
}
