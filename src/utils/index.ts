import { isEmpty } from 'lodash';
import { POPULAR_LANGUAGES } from '../constants';
import { nameToEmoji } from 'gemoji';

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

// GITHUB Qualifier for search
export const GHQ = {
  stringify: function (obj: Record<string, string | undefined>): string {
    return Object.entries(obj).filter(([_,v]) => !isEmpty(v)).map((pair) => pair.join(':')).join(' ')
  },

  parse: function(value: string): Record<string, string> {
    const isValid = /^\w+:\w+( \w+:\w+)*$/.test(value);
    if(!isValid) return {};

    const pairs = value.split(' ').map(pair => pair.trim().split(':'))
    const res: Record<string, string> = {};
    pairs.forEach(([k,v]) => {
      res[k] = v
    })
    return res;
  }
}

export function convertTextToEmoji(text: string): string {
  return text.replaceAll(/:(\w+):/g, (sub, emojiText) => {
    return isEmpty(nameToEmoji[emojiText]) ? sub : nameToEmoji[emojiText];
  });
}