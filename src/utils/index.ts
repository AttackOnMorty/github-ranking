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

export function renderRank(rank: number): string {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return rank.toString();
  }
}
