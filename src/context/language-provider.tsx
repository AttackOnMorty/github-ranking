'use client';

import { createContext } from 'react';

import { useLanguages } from '@/hooks/use-github-api';

export const LanguageContext = createContext<string[]>([]);

export default function LanguageProvider({
  children,
}: React.PropsWithChildren) {
  const { data: languages = [], error } = useLanguages();

  if (error) {
    console.error('Error loading languages:', error);
  }

  return (
    <LanguageContext.Provider value={languages}>
      {children}
    </LanguageContext.Provider>
  );
}
