import { computed, ref, watch } from 'vue';

// TODO: Add all languages
type Locale =
  | 'en-US'
  | 'en-GB'
  | 'ru-RU';

export function useLocale() {
  const locales = ref<Locale[]>(['en-US', 'en-GB', 'ru-RU']);

  const locale = ref<Locale>('en-US');

  const names = computed(() => {
    const [ code = 'en' ] = locale.value.split('-');

    return new Intl.DisplayNames([code], {
      type: 'language',
    }).of(code);
  });

  watch(locale, (locale) => {
    document.documentElement.lang = locale;
  }, { immediate: true });

  return {
    locales,
    locale,
    names,
  };
}
