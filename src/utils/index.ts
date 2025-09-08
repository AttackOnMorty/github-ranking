import { nameToEmoji } from 'gemoji';

const POPULAR_LANGUAGES = [
  'C',
  'C#',
  'C++',
  'CoffeeScript',
  'CSS',
  'Dart',
  'DM',
  'Elixir',
  'Go',
  'Groovy',
  'HTML',
  'Java',
  'JavaScript',
  'Kotlin',
  'Objective-C',
  'Perl',
  'PHP',
  'PowerShell',
  'Python',
  'Ruby',
  'Rust',
  'Scala',
  'Shell',
  'Swift',
  'TypeScript',
];

// TODO: Add types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export function formatNumber(value: number): string | number {
  return value >= 1000 ? `${Math.floor(value / 1000)}k` : value;
}

export function convertTextToEmoji(text: string): string {
  return text.replaceAll(/:(\w+):/g, (sub, emojiText) => {
    return nameToEmoji[emojiText] === undefined ? sub : nameToEmoji[emojiText];
  });
}
