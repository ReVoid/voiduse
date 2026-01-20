import { computed, ref, watch } from 'vue';

import { useLoading } from '@/composables';

// TODO: Add all languages
type Locale =
  | 'en-US'
  | 'en-GB'
  | 'ru-RU';

type Locales = Locale[];

// TODO: Design & implement
export function useLocale() {
  const locales = ref<Locales>(['en-US', 'en-GB', 'ru-RU']);

  const locale = ref<Locale>('en-US');

  const names = computed(() => {
    const [ code = 'en' ] = locale.value.split('-');

    return new Intl.DisplayNames([code], {
      type: 'language',
    }).of(code);
  });

  // TODO: Make it global
  const { isLoading } = useLoading();

  watch(locale, (locale) => {
    document.documentElement.lang = locale;
  }, { immediate: true });

  return {
    locales,
    locale,
    names,
    isLoading,
  };
}
