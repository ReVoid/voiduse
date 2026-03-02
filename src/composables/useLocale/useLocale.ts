import {
  ref,
  computed,
  watch,
} from 'vue';

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
// TODO: Add locale fallback map
export function useLocale(initial: Locale | Language = 'en-US') {
  const _locale = ref<Locale>(toLocale(initial));
  const _language = ref<Language>(toLanguage(initial));

  /**
   *  Current locale.
   *
   *  @example
   *  ```ts
   *  const { locale } = useLocale();
   *
   *  locale.value; // "en-US"
   *  ````
   */
  const locale = computed<Locale, Locale | Language>({
    get() {
      return _locale.value;
    },
    set(value) {
      _locale.value = toLocale(value);
      _language.value = toLanguage(value);
    },
  });

  const locales = ref<Locales>(LOCALES);

  /**
   * Current language.
   *
   * @default
   * "ru"
   *
   * @example
   * ```ts
   * const { language, locale } = useLocale();
   *
   * // Changing by language
   * language.value = "en";
   *
   * // Changing by locale
   * language.value = "en-US";
   *
   * // Changes will be reflected to locale
   * language.value; // "en"
   * locale.value; // "en-US"
   * ```
   */
  const language = computed<Language, Language | Locale>({
    get() {
      return _language.value;
    },
    set(value) {
      _language.value = toLanguage(value);
      _locale.value = toLocale(value);
    },
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
