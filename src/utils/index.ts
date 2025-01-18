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

export function getTop3(rank: number): string | null {
  let top3 = null;

  if (rank === 1) {
    top3 = '🥇';
  } else if (rank === 2) {
    top3 = '🥈';
  } else if (rank === 3) {
    top3 = '🥉';
  }

  return top3;
}
