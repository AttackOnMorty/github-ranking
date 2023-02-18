import { POPULAR_LANGUAGES } from '../constants';

export function getLanguagesOptions(languages: string[]): any[] {
  const popularLanguageOptions = POPULAR_LANGUAGES.map((value) => ({
    value,
    label: value,
  }));

  if (languages.length === 0) {
    return popularLanguageOptions;
  }

  const popularLanguages = {
    label: 'Popular',
    options: popularLanguageOptions,
  };
  const otherLanguages = {
    label: 'Everything else',
    options: languages
      .filter((value) => !POPULAR_LANGUAGES.includes(value))
      .map((value) => ({
        value,
        label: value,
      })),
  };
  return [popularLanguages, otherLanguages];
}

export function scrollToTop(): void {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
