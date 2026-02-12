import {
  ref,
  computed,
  watch,
} from 'vue';

import {
  useLoading,
} from '@/composables';

// TODO: Add all languages
type Locale =
  | 'en-US'
  | 'en-GB'
  | 'ru-RU';

type Locales = Locale[];

type Language = Locale extends `${infer Language}-${string}`
  ? Language
  : never;

type Languages = Language[];

type Region = Locale extends `${string}-${infer Region}`
  ? Region
  : never;

type Regions = Region[];


// TODO: Design & implement
export function useLocale() {
  const locale = ref<Locale>('en-US');

  const locales = ref<Locales>(['en-US', 'en-GB', 'ru-RU']);

  const language = computed<Language>(() => {
    const [language] = locale.value.split('-');
    return language as Language;
  });

  const languages = computed<Languages>(() => {
    return locales.value.map((locale) => {
      const [language] = locale.split('-');
      return language as Language;
    });
  });

  const region = computed<Region>(() => {
    const [, region] = locale.value.split('-');
    return region as Region;
  });

  const regions = computed<Regions>(() => {
    return locales.value.map((locale) => {
      const [, region] = locale.split('-');
      return region as Region;
    });
  });

  const script = computed<string>(() => {
    throw new Error('Not implemented yet.');
  });

  // TODO: Make it global
  const { isLoading } = useLoading();

  watch(locale, (locale) => {
    document.documentElement.lang = locale;
  }, { immediate: true });

  return {
    locale,
    locales,
    language,
    languages,
    region,
    regions,
    isLoading,
  };
}
