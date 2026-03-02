import {
  ref,
  computed,
  watch,
} from 'vue';

import {
  useLoading,
} from '../../composables';

import type {
  Locale,
  Locales,
  Language,
  Languages,
  Region,
  Regions,
} from './useLocale.types.ts';

import {
  LOCALES,
} from './useLocale.constants.ts';

import type {
  Union,
} from 'ts-toolbelt';

import {
  uniq,
} from 'lodash-es';

// TODO: Complete implementation.
export function useLocale() {
  const locale = ref<Locale>('en-US');

  const locales = ref<Locales>(LOCALES);

  const language = computed<Language>(() => {
    return toLanguage(locale.value);
  });

  const languages = computed<Languages>(() => {
    // uniq prevents duplicates, as ["en-US", "en-GB"] => ["en", "en"].
    return uniq(locales.value.map(toLanguage));
  });

  const region = computed<Region>(() => {
    return toRegion(locale.value);
  });

  const regions = computed<Regions>(() => {
    return locales.value.map(toRegion);
  });

  // TODO: Make it global
  const { isLoading } = useLoading();

  /**
   * Checks whether a given locale or language exists in the list of available locales.
   *
   * @example
   * ```ts
   * const { isAvailable } = useLocale();
   *
   * isAvailable("en-US"); // true
   * isAvailable("en_US"); // true
   * isAvailable("en"); // true
   * isAvailable("Definitely not a locale or language"); // false
   * isAvailable(undefined); // false
   * isAvailable(null); // false
   * ```
   */
  function isAvailable(value?: Union.Nullable<string>): boolean {
    if (!value) {
      return false;
    }

    const [
      language, // "en-US" => "en", "en_US" => "en, "en" => "en".
    ] = value.split(/[-_]/);

    if (!language) {
      return false;
    }

    return languages.value.includes(language.toLowerCase() as Language);
  }

  // <html lang="en">
  watch(
    language,
    (language) => {
      document.documentElement.lang = language;
    },
    { immediate: true },
  );

  return {
    locale,
    locales,
    language,
    languages,
    region,
    regions,
    isLoading,
    isAvailable,
  };
}

// TODO: Make these utils more reliable and strict.
function toLanguage(value: string): Language {
  const [
    language
  ] = value.split('-');

  return language as Language;
}

function toLocale(value: string): Locale {
  return LOCALES.find((locale) => locale.startsWith(value))!;
}

function toRegion(value: string): Region {
  const [
    ,
    region
  ] = value.split('-');

  return region as Region;
}
